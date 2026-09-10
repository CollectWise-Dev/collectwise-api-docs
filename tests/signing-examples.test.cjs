// Validate the actual MDX examples; no duplicate client implementation or API checkout.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');
const vm = require('node:vm');
const mdx = readFileSync(join(__dirname, '../authorization.mdx'), 'utf8');
function snippet(language) {
  const match = mdx.match(new RegExp('```' + language + '[^\\n]*\\n([\\s\\S]*?)```'));
  assert.ok(match, `${language} example is present`);
  return match[1];
}
const context = { module: { exports: {} }, Buffer,
  require(name) { assert.equal(name, 'node:crypto'); return require(name); } };
vm.runInNewContext(snippet('javascript'), context, { timeout: 1000 });
const { signRequest } = context.module.exports;
const secret = Buffer.from(Array.from({ length: 32 }, (_, n) => n)).toString('base64url');
const input = { secretBase64url: secret, method: 'POST', rawPath: '/text/send', rawQueryString: 'a=1&a=%2f', body: Buffer.from('{"a":1}'), timestamp: '1700000000' };
const expected = 'v1=8592459a26573c3c15b4c03891462431208ca5221439b6cb1a2e11ad1f779252';

test('documented JavaScript matches the independent CW1 vector', () => {
  assert.equal(signRequest(input)['x-cw-signature'], expected);
});
test('documented JavaScript rejects noncanonical base64url secrets', () => {
  for (const secretBase64url of [secret + '=', 'a'.repeat(43)]) {
    assert.throws(() => signRequest({ ...input, secretBase64url }));
  }
});
test('documented Python and JavaScript agree on exact body and target bytes', () => {
  const vectors = [input, { ...input, method: 'GET', body: Buffer.alloc(0) },
    { ...input, rawPath: '/a%2Fb', rawQueryString: 'x=2&x=1&space=%20', body: Buffer.from('{ "text": "café" }') }];
  const result = spawnSync('python3', ['-c', snippet('python') + `
import sys, json
print(json.dumps([sign_request(v['secretBase64url'],v['method'],v['rawPath'],v['rawQueryString'],v['body'].encode('utf-8'),v['timestamp']) for v in json.load(sys.stdin)]))`], {
    input: JSON.stringify(vectors.map(v => ({ ...v, body: v.body.toString('utf8') }))),
    encoding: 'utf8', timeout: 5000,
    env: { PATH: process.env.PATH, PYTHONDONTWRITEBYTECODE: '1', PYTHONUTF8: '1' },
  });
  assert.equal(result.status, 0, result.stderr || result.error?.message);
  assert.deepEqual(JSON.parse(result.stdout), JSON.parse(JSON.stringify(vectors.map(signRequest))));
});

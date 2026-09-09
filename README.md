# CollectWise API Docs

Welcome to the CollectWise API documentation! This guide provides the resources you need to integrate with our platform, manage debtor information, and automate debt collection processes effectively.

## Key Features
- **Guide Pages**: Step-by-step instructions for setup and integration.
- **Debtor Management**: Detailed API references for creating, updating, and deleting debtor records.
- **Statuses**: Explanation of debtor statuses for tracking account conditions.
- **Webhooks**: Configure real-time updates for debtor interactions.

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview documentation changes:

```bash
npm i -g mintlify
```

Then run 

```bash
mintlify dev
```

## Publishing Changes

Set up the Mintlify GitHub App for automatic deployment to production.

## Troubleshooting

- **Mintlify dev isn’t running**: Run `mintlify install` to reinstall dependencies.
- **404 Error**: Ensure you’re in the correct folder with `mint.json`.

Explore each section for further guidance!
## Documentation conventions and example checks

Customer-facing API security instructions and signing examples live in
`authorization.mdx`. Follow the existing MDX frontmatter, `CodeGroup` language
tabs, `Steps` guides, and OpenAPI-backed endpoint pages. Keep operational rollout
instructions outside customer pages. Do not duplicate the signing implementation
in another repository just to test it.

Run the checks with Node.js and Python 3 (standard library only):

```bash
node --test tests/signing-examples.test.cjs
```

The tests extract and execute the code shown in the MDX page, using synthetic
vectors without making API calls. API server-verification tests remain in the
API repository. Security documentation must ship with the approved feature
release; a local docs commit is not publication approval.

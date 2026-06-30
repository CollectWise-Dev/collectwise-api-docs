
<!-- shadow-cloud-harness:start -->
## Shadow cloud harness

This repo is wired for Shadow cloud agents (Cursor / Codex / OpenCode / Claude). At setup,
`cloud-bootstrap.sh` (from github.com/shivamratnani/agent-configs) clones the Obsidian vault,
builds the search index, and writes `~/.shadow-env` — `source ~/.shadow-env` before working.

- **Vault** (decisions/runbooks/session memory): `vault-cli.sh search|read|write`, `vault-sync.sh push|pull`, or the `vault_search`/`vault_read`/`vault_write` MCP tools. Query the vault before generating ungrounded answers.
- **Prod logs**: `grafana-query.sh '<LogQL>' --since 1h` (needs `GRAFANA_SERVICE_ACCOUNT_TOKEN` secret), or `mcp__grafana__query_loki_logs`. Datasource `grafanacloud-logs`.
- **Session discipline**: run recall at start; at end write `_sessions/YYYY-MM-DD/HHMM-<agent>-<slug>.md` and `vault-sync.sh push`.
<!-- shadow-cloud-harness:end -->

#!/usr/bin/env bash
set -uo pipefail
# Token (a fine-grained read-only PAT over shivamratnani/{obsidian,agent-configs}) lets git
# clone the private repos; without it we fall back to the sandbox's ambient creds.
if [ -n "${SHADOW_GIT_TOKEN:-}" ]; then
  git config --global credential.helper store
  printf 'https://x-access-token:%s@github.com\n' "$SHADOW_GIT_TOKEN" > "$HOME/.git-credentials"
  chmod 600 "$HOME/.git-credentials"
fi
AC="$HOME/agent-configs"
git clone --depth=1 https://github.com/shivamratnani/agent-configs "$AC" 2>/dev/null \
  || git -C "$AC" pull --quiet || true
if [ -f "$AC/shared/bin/cloud-bootstrap.sh" ]; then bash "$AC/shared/bin/cloud-bootstrap.sh"
else echo "shadow-bootstrap: agent-configs unavailable — set SHADOW_GIT_TOKEN secret"; fi

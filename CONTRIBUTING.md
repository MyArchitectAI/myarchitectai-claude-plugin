# Contributing

Thanks for your interest in improving the MyArchitectAI Claude Code plugin! By contributing, you
agree that your contributions are licensed under the project's [MIT License](./LICENSE). Please also
read our [Code of Conduct](./CODE_OF_CONDUCT.md). For security issues, follow the
[Security Policy](./SECURITY.md) — don't open a public issue.

## What's in this repo

```
.claude-plugin/
  plugin.json        # plugin manifest (declares the MCP server + userConfig api_key)
  marketplace.json   # single-plugin marketplace (source ".")
plugin-mcp.json      # MCP server launch config (npx @myarchitectai/mcp)
commands/render.md   # the /myarchitectai:render command
skills/compare-renders/SKILL.md  # the /myarchitectai:compare-renders skill
```

The plugin **bundles** the [`@myarchitectai/mcp`](https://github.com/MyArchitectAI/myarchitectai-api-mcp)
server (it doesn't vendor its code). Server bugs belong in that repo; this repo owns the command, the
skill, and the launch config.

## Developing & testing

Requires Node.js (for the validator) and Claude Code (to try the plugin).

```bash
node scripts/validate.mjs     # validate manifests + layout (this is what CI runs)
claude plugin validate .      # full validation with the Claude Code CLI
```

To try the plugin locally without publishing, add this checkout as a local marketplace:

```
/plugin marketplace add /absolute/path/to/myarchitectai-claude-plugin
/plugin install myarchitectai@myarchitectai
```

or launch Claude Code with `claude --plugin-dir /absolute/path/to/myarchitectai-claude-plugin`. To
test against a **local build** of the server instead of the published npm package, see the
"Local development" note in the [README](./README.md).

## Pull requests

We use a standard fork-and-pull-request workflow.

1. Fork the repo, then create a topic branch off `main`.
2. Make your change — keep it focused.
3. Run `node scripts/validate.mjs` (and ideally `claude plugin validate .`) before pushing. CI runs
   the validator on every PR, including PRs from forks.
4. If you change the plugin's behavior, bump `version` in **both** `.claude-plugin/plugin.json` and
   `.claude-plugin/marketplace.json`, and add a `CHANGELOG.md` entry under `Unreleased`.
5. Keep the tool names referenced in `commands/` and `skills/` in sync with the MCP server's tool
   names.
6. Open a PR against `main`, fill out the template, and link the issue with `Closes #123`.

A maintainer will review for correctness and clarity. Small, focused PRs are reviewed fastest.

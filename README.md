# MyArchitectAI — Claude Code plugin

[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

A [Claude Code](https://code.claude.com) plugin that bundles the
[MyArchitectAI](https://www.myarchitectai.com) MCP server plus a render-comparison skill and a
guided render command.

## What's included

- **MCP server** `myarchitectai` — 10 tools: exterior/interior render, style transfer,
  text-to-image, 4K upscale, plus `preview_image`, `save_image`, `validate_image_url`,
  `usage_summary`, and `list_recent_generations`. Launched via `npx` from the
  [`@myarchitectai/mcp`](https://www.npmjs.com/package/@myarchitectai/mcp) package.
- **Skill** `/myarchitectai:compare-renders` — multimodal comparison of two images (source vs
  render, render vs 4K upscale, or competing variants).
- **Command** `/myarchitectai:render` — guided validate → render → preview → save workflow.

## Install

```
/plugin marketplace add MyArchitectAI/myarchitectai-claude-plugin
/plugin install myarchitectai@myarchitectai
```

Claude Code prompts once for your **MyArchitectAI API key** (stored encrypted in the OS keychain;
get one at https://portal.myarchitectai.com) and injects it as `MYARCHITECTAI_API_KEY`.

## How the MCP server is launched

[`plugin-mcp.json`](./plugin-mcp.json) runs `npx -y @myarchitectai/mcp`, so the plugin pulls the
published [`@myarchitectai/mcp`](https://www.npmjs.com/package/@myarchitectai/mcp) server from npm.

**Local development (before publishing):** point the server at a local build of the sibling MCP
repo instead — edit `plugin-mcp.json`:

```json
{
  "mcpServers": {
    "myarchitectai": {
      "type": "stdio",
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/../my-architect-ai-mcp/dist/index.js"],
      "env": { "MYARCHITECTAI_API_KEY": "${user_config.api_key}" }
    }
  }
}
```

This assumes the workspace layout `my-architect-ai/{my-architect-ai-mcp,my-architect-ai-plugin}` and
a built `dist/` in the MCP repo (`npm run build` there). Then test with:

```
claude --plugin-dir /absolute/path/to/my-architect-ai-plugin
```

## Layout

```
.claude-plugin/
  plugin.json          # manifest (declares MCP via ./plugin-mcp.json + userConfig api_key)
  marketplace.json     # single-plugin marketplace (source ./)
plugin-mcp.json        # MCP server launch config (npx)
skills/compare-renders/SKILL.md
commands/render.md
```

## Related

- MCP server source & docs: [`myarchitectai-api-mcp`](https://github.com/MyArchitectAI/myarchitectai-api-mcp)

## Contributing

Issues and PRs are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md), the
[Code of Conduct](./CODE_OF_CONDUCT.md), and the [Security Policy](./SECURITY.md) for reporting
vulnerabilities privately. CI validates the plugin manifests on every PR (`node scripts/validate.mjs`).

## License

[MIT](./LICENSE) © MyArchitectAI

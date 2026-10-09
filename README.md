# MyArchitectAI — Claude Code plugin

A [Claude Code](https://code.claude.com) plugin that bundles [MyArchitectAI MCP 1.0.0](https://www.npmjs.com/package/@myarchitectai/mcp/v/1.0.0), a render-comparison skill, and a guided render command.

## What's included

- **MCP server** `myarchitectai` — 17 tools covering all 12 API operations and five image/session utilities.
- **Skill** `/myarchitectai:compare-renders` — visual comparison of existing renders, 4K/8K upscales, texture or atmosphere edits, and competing variants. Accepts image URLs, data URIs, or local paths without generation charges.
- **Command** `/myarchitectai:render` — guided validate → render → preview → save workflow, with USD cost, balance, and request ID reporting.

| Tool | Purpose |
| --- | --- |
| `render_exterior` | Render an exterior from an image |
| `render_interior` | Render an interior from an image |
| `style_transfer` | Apply a reference image's style |
| `text_to_image` | Generate an image from a prompt |
| `auto_prompt` | Describe an image as prompt text |
| `edit_by_prompt` | Edit an image using instructions and an optional reference |
| `change_textures` | Retexture a mask using exactly one of a prompt or reference image |
| `set_atmosphere` | Change interior lighting or exterior time, season, and weather |
| `animate` | Create a video from a start frame and motion prompt |
| `upscale` | Upscale to 4K or 8K |
| `upscale_4k` | Legacy 4K compatibility tool; prefer `upscale` |
| `balance` | Read the current API account balance |
| `preview_image` | Display an image inline |
| `save_image` | Save an image to disk |
| `validate_image_url` | Check URL reachability and image content type |
| `usage_summary` | Show session requests, USD spent, and last-known balance |
| `list_recent_generations` | List recent image, video, and text results |

Generation tools, including `auto_prompt`, charge the API account in USD. `balance` and the five utilities have no MyArchitectAI API charge. Image results contain an output URL array; `auto_prompt` returns text and `animate` returns video URLs. Image preview/save tools do not handle video. At 8K, upscale output must be JPG or WebP; AVIF is unsupported for upscale. See the [MCP tool reference](https://github.com/MyArchitectAI/myarchitectai-api-mcp#features) for parameters.

Paid calls automatically retry only explicitly uncharged HTTP 429/502 responses without a content-safety code. After a timeout or uncertain failure, inspect the API request log before repeating a paid call. If previewing or saving fails, reuse the generated URL instead of generating again.

Content-safety failures return `isError: true` and `structuredContent` with `error`, `code`, and any provided `cost`, `balance`, and `requestId`. `CONTENT_POLICY_VIOLATION` reports `Request blocked by content policy`; a positive final `cost` remains charged without a usable output. `SAFETY_CHECK_UNAVAILABLE` reports `Content safety check unavailable` and follows the refund path: `cost` becomes `0` when the refund succeeds, but may remain positive if it fails. Report the returned final cost and balance rather than assuming a refund. Neither code triggers automatic retries or provider fallback, including at HTTP 429/502. An unavailable check may be retried later only by an explicit user decision.

`usage_summary` includes retained positive policy charges in USD totals and counts rejected requests as failed generations. Successful-generation counts and `list_recent_generations` still include successful outputs only.

## Install

Requires Node.js 18.14.1 or newer with `npx`, Claude Code with plugin support, and a [MyArchitectAI API key](https://portal.myarchitectai.com).

```
/plugin marketplace add MyArchitectAI/myarchitectai-claude-plugin
/plugin install myarchitectai@myarchitectai
```

Claude Code prompts for your **MyArchitectAI API key** when enabling the plugin and injects it as `MYARCHITECTAI_API_KEY`. The option is marked sensitive; storage depends on the platform's available credential store. See [Claude Code user configuration](https://code.claude.com/docs/en/plugins-reference#user-configuration).

## Update

For an existing installation, refresh the marketplace and update the plugin:

```text
/plugin marketplace update myarchitectai
/plugin update myarchitectai@myarchitectai
```

Start a new Claude Code session and check `/mcp` for the `myarchitectai` server. Plugin 1.0.0 launches MCP 1.0.0 with 17 tools. See [CHANGELOG.md](./CHANGELOG.md) for changes.

## How the MCP server is launched

[`plugin-mcp.json`](./plugin-mcp.json) runs `npx -y @myarchitectai/mcp@1.0.0`. The exact version keeps the tool contract aligned with this plugin release; future MCP upgrades require a plugin update.

**Local development:** build the MCP source with `npm run build` in its repository, then replace the launch command and arguments in your local `plugin-mcp.json` with the absolute path to that build:

```json
{
  "mcpServers": {
    "myarchitectai": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/myarchitectai-api-mcp/dist/index.js"],
      "env": { "MYARCHITECTAI_API_KEY": "${user_config.api_key}" }
    }
  }
}
```

Then load the local plugin:

```
claude --plugin-dir /absolute/path/to/myarchitectai-claude-plugin
```

Keep local build paths out of published commits. Run the published `npx` command outside the MCP source repository, where npm may otherwise resolve the local package.

## Validation

This repository contains plugin configuration and Markdown; it has no build or lint scripts. Validate both manifests and bundled instructions with Claude Code:

```sh
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict commands
claude plugin validate --strict skills
git diff --check
```

Check the launched MCP's version and tool list before release. Use fixture responses to exercise paid tools without account charges, and treat live balance/auth checks separately from paid generation tests.

## Layout

```
.claude-plugin/
  plugin.json          # manifest (declares MCP via ./plugin-mcp.json + userConfig api_key)
  marketplace.json     # single-plugin marketplace (source ./)
plugin-mcp.json        # MCP server launch config (npx)
skills/compare-renders/SKILL.md
commands/render.md
CHANGELOG.md
```

## Related

- MCP server source & docs: [`myarchitectai-api-mcp`](https://github.com/MyArchitectAI/myarchitectai-api-mcp)

## License

[MIT](./LICENSE)

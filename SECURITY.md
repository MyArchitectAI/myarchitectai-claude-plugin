# Security Policy

## Reporting a vulnerability

**Please do not report security issues through public GitHub issues, discussions, or pull requests.**

Report privately through GitHub's
[private vulnerability reporting](https://github.com/MyArchitectAI/myarchitectai-claude-plugin/security/advisories/new)
— the **Report a vulnerability** button on the repository's **Security** tab — or contact the
maintainers via <https://www.myarchitectai.com>. We aim to acknowledge within **3 business days**.

## Scope

This plugin bundles the [`@myarchitectai/mcp`](https://github.com/MyArchitectAI/myarchitectai-api-mcp)
server and adds a command and a skill.

- Vulnerabilities in the **server itself** (network/auth/credential handling, the rendering tools)
  should be reported on the
  [MCP server's security page](https://github.com/MyArchitectAI/myarchitectai-api-mcp/security).
- Report issues specific to **this plugin** — its command, skill, or MCP launch config
  (`plugin-mcp.json`) — here.

## API keys

When you install the plugin, Claude Code prompts for your MyArchitectAI API key and stores it
**encrypted in your OS keychain**; it is passed to the bundled server as `MYARCHITECTAI_API_KEY` and
is never committed or logged. **Never paste your full API key** in an issue or PR. If a key is
exposed, rotate it in the [portal](https://portal.myarchitectai.com) immediately.

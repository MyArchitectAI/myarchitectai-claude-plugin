# Changelog

## 1.0.0

- Pin the bundled server to published `@myarchitectai/mcp@1.0.0` and align plugin and marketplace versions.
- Report structured content-safety errors with their final USD cost, balance, and request ID; retain positive policy charges and avoid assuming unavailable checks were refunded.
- Stop automatic retries and provider fallback for both safety codes, and preserve explicit user control over retrying an unavailable check.
- Document failed-generation accounting and the server's Node.js 18.14.1 minimum; retain all 17 tools and existing render-comparison workflows.

## 0.2.0

- Pin the bundled server to tested `@myarchitectai/mcp@0.2.0` and document all 17 tools, including editing, textures, atmosphere, animation, auto-prompt, 4K/8K upscale, and live balance.
- Correct plugin-scoped MCP tool names in the render command and comparison skill.
- Update the render workflow for image arrays, USD cost and balance, request IDs, and safe handling of uncertain paid calls.
- Extend image comparison guidance to 8K and edited renders, data URIs, and local paths; distinguish images from video and text outputs.
- Align plugin and marketplace versions and document installation, updates, and validation.

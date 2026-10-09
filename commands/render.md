---
name: render
description: Guided MyArchitectAI render — validate an input image URL, generate an exterior or interior render, then preview and save the result.
argument-hint: [image-url] [exterior|interior] [optional style notes]
allowed-tools: mcp__plugin_myarchitectai_myarchitectai__validate_image_url mcp__plugin_myarchitectai_myarchitectai__render_exterior mcp__plugin_myarchitectai_myarchitectai__render_interior mcp__plugin_myarchitectai_myarchitectai__preview_image mcp__plugin_myarchitectai_myarchitectai__save_image mcp__plugin_myarchitectai_myarchitectai__usage_summary mcp__plugin_myarchitectai_myarchitectai__balance
---

Run a complete render workflow for: $ARGUMENTS

1. **Parse** the arguments: an image URL, an optional kind (`exterior` or `interior`, default `exterior`), and optional style notes used to build the prompt.
2. **Validate** the URL first with `validate_image_url`. If it is not a reachable image, stop and report the problem before making a paid request.
3. **Render** once with `render_exterior` (or `render_interior` if requested), passing the source URL as `image`, `outputFormat: "jpg"`, and a `prompt` built from the style notes when provided. Do not add a paid `auto_prompt` call unless the user asks for it.
4. **Preview** each returned image URL from the render result's `structuredContent.output` array with `preview_image` so the user can see it.
5. **Save** the rendered images with `save_image` and report the saved paths. A preview or save failure does not require another render; retain the generated URLs so those steps can be retried separately.
6. Report the **cost and remaining balance in USD** from `structuredContent.cost` and `structuredContent.balance`, plus `requestId` when present. Use the read-only `balance` tool if the user asks for the current account balance; `usage_summary` reports session totals and a last-known balance.

If a paid call fails, stop and report the error and any request ID. For a content-safety failure, also report `structuredContent.code` and the returned final `cost` and `balance` when provided, including zero values. `CONTENT_POLICY_VIOLATION` means the request was blocked; a positive cost remains charged without a usable output. `SAFETY_CHECK_UNAVAILABLE` follows the refund path, but only a returned cost of `0` confirms no retained charge. Never assume a refund when cost is positive or absent.

Neither safety code triggers an automatic retry or provider fallback, even at HTTP 429/502. Do not manually repeat a blocked request; an unavailable check may be retried later only if the user explicitly chooses to do so. The MCP handles retries only for other explicitly uncharged HTTP 429/502 responses. Do not manually repeat a paid call after a timeout, connection failure, or other uncertain result; inspect the API request log first to avoid a duplicate charge.

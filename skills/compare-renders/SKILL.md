---
name: compare-renders
description: Compare two or more architectural images (source vs render, render vs 4K/8K upscale, edited textures or atmosphere, or competing style variants) and assess differences in fidelity, materials, lighting, geometry, color, detail, and artifacts. Use when the user asks to compare renders, spot what changed, check specific features, or decide which option is better.
argument-hint: [image-url-or-path-a] [image-url-or-path-b]
allowed-tools: mcp__plugin_myarchitectai_myarchitectai__preview_image
---

# Compare architectural images

You are comparing two (or more) images — typically a source and its render, a render and its 4K/8K upscale, an image before and after a texture or atmosphere edit, or competing style variants. You are multimodal: load the images and judge them by actually looking, not by guessing from URLs or filenames. This workflow compares existing images; it does not make paid generation calls.

## Steps

1. Load each image into context with `mcp__plugin_myarchitectai_myarchitectai__preview_image` (one call per image, passing its URL, data URI, or absolute local path as `url`). This incurs no MyArchitectAI API charge and returns the image inline so you can see it. `animate` returns video URLs and `auto_prompt` returns text; neither is an image input for this tool. For video comparisons, request still frames or use a video-capable viewer.
2. Compare across these dimensions:
   - **Fidelity to source** — is the original geometry, layout, and structure preserved?
   - **Materials & textures** — surfaces, finishes, realism.
   - **Lighting & shadows** — direction, softness, time of day, consistency.
   - **Color & tone** — palette, white balance, saturation.
   - **Proportions & perspective** — scale, vanishing points, distortion.
   - **Detail & sharpness** — resolution and fine detail (especially for upscales).
   - **Artifacts** — warping, hallucinated elements, seams, noise.
3. If the user named specific features to check (windows, roofline, landscaping, a sign, etc.), evaluate those explicitly.

## Output

- A short per-dimension comparison (A vs B) as a compact table or bullets.
- The notable differences and any artifacts you can see.
- A clear verdict: which image better serves the user's stated goal, or a precise summary of what changed.

Stay grounded in what is actually visible in the images. If an image fails to load, say so and ask for a reachable image URL, a valid image data URI, or an absolute image path accessible to the MCP process.

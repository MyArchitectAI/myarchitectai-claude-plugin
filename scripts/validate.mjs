#!/usr/bin/env node
// Dependency-free validation of the plugin's manifests and layout — safe for CI
// (no Claude Code CLI or auth required). For full validation, maintainers can
// also run `claude plugin validate .` locally.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
const ok = [];

function readJson(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    problems.push(`missing file: ${rel}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (err) {
    problems.push(`invalid JSON in ${rel}: ${err.message}`);
    return null;
  }
}

// plugin.json
const plugin = readJson('.claude-plugin/plugin.json');
if (plugin) {
  if (!plugin.name) problems.push('plugin.json: missing "name"');
  if (!plugin.version) problems.push('plugin.json: missing "version"');
  if (plugin.name && plugin.version) ok.push(`plugin.json: ${plugin.name}@${plugin.version}`);
  if (typeof plugin.mcpServers === 'string') {
    const rel = plugin.mcpServers.replace(/^\.\//, '');
    if (!existsSync(join(root, rel))) {
      problems.push(`plugin.json: mcpServers points to missing file "${plugin.mcpServers}"`);
    } else {
      readJson(rel); // parse-check the referenced MCP config
      ok.push(`mcpServers config: ${plugin.mcpServers}`);
    }
  }
}

// marketplace.json
const market = readJson('.claude-plugin/marketplace.json');
if (market) {
  if (!market.name) problems.push('marketplace.json: missing "name"');
  if (!Array.isArray(market.plugins) || market.plugins.length === 0) {
    problems.push('marketplace.json: "plugins" must be a non-empty array');
  } else {
    for (const p of market.plugins) {
      if (!p?.name || !p?.source) {
        problems.push(`marketplace.json: every plugin needs "name" and "source" (offending: ${JSON.stringify(p)})`);
      }
    }
    if (market.name) ok.push(`marketplace.json: ${market.name} (${market.plugins.length} plugin(s))`);
  }
}

// commands/*.md
const cmdDir = join(root, 'commands');
if (existsSync(cmdDir)) {
  const cmds = readdirSync(cmdDir).filter((f) => f.endsWith('.md'));
  if (cmds.length === 0) problems.push('commands/: no .md command files found');
  else ok.push(`commands: ${cmds.join(', ')}`);
}

// skills/*/SKILL.md
const skillsDir = join(root, 'skills');
if (existsSync(skillsDir)) {
  const skills = readdirSync(skillsDir).filter((e) => statSync(join(skillsDir, e)).isDirectory());
  for (const s of skills) {
    if (!existsSync(join(skillsDir, s, 'SKILL.md'))) problems.push(`skills/${s}: missing SKILL.md`);
  }
  if (skills.length) ok.push(`skills: ${skills.join(', ')}`);
}

for (const line of ok) console.log(`  ✓ ${line}`);
if (problems.length > 0) {
  console.error('\nPlugin validation failed:');
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\n✔ Plugin manifests and layout look valid.');

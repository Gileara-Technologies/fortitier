#!/usr/bin/env node
/**
 * Lightweight secrets scanner for Fortitier repo.
 * Fails on common key patterns in tracked text files.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set([
  "node_modules",
  ".next",
  ".open-next",
  ".git",
  ".wrangler",
  "coverage",
  "dist",
  "out",
]);

const patterns = [
  { name: "OpenAI-ish key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { name: "Resend key", re: /\bre_[A-Za-z0-9]{20,}\b/g },
  { name: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g },
  { name: "Generic API key assignment", re: /(?:api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]{16,}['\"]/gi },
];

const textExt = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".toml",
  ".yml",
  ".yaml",
  ".css",
  ".env",
  ".txt",
]);

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!textExt.has(ext) && !entry.name.startsWith(".env")) continue;
    out.push(full);
  }
  return out;
}

const files = await walk(root);
const hits = [];

for (const file of files) {
  if (file.endsWith("scan-secrets.mjs")) continue;
  if (file.endsWith(".env.example")) continue;
  const info = await stat(file);
  if (info.size > 1_500_000) continue;
  const text = await readFile(file, "utf8");
  for (const { name, re } of patterns) {
    re.lastIndex = 0;
    if (re.test(text)) {
      hits.push({ file: path.relative(root, file), name });
    }
  }
}

if (hits.length) {
  console.error("Secrets scan FAILED:");
  for (const hit of hits) {
    console.error(` - ${hit.name} in ${hit.file}`);
  }
  process.exit(1);
}

console.log(`Secrets scan OK (${files.length} files).`);

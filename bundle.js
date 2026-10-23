// bundle.js - Production CSS Bundler for AthoFolioo
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'static', 'css');
const files = [
  path.join(baseDir, 'output.css'),
  path.join(baseDir, 'main', 'base.css'),
  path.join(baseDir, 'main', 'motion.css'),
  path.join(baseDir, 'main', 'cursor.css'),
  path.join(baseDir, 'main', 'loader.css'),
  path.join(baseDir, 'main', 'animations.css'),
  path.join(baseDir, 'main', 'text-effects.css')
];

let content = files.map(f => {
  const rel = path.relative(__dirname, f);
  return `/* ── ${rel} ── */\n` + fs.readFileSync(f, 'utf8');
}).join('\n');

// Clean, safe CSS minification
// 1. Remove comments
content = content.replace(/\/\*[\s\S]*?\*\//g, '');
// 2. Collapse excessive whitespace
content = content.replace(/\s+/g, ' ');
// 3. Remove whitespace around CSS operators and punctuation
content = content.replace(/\s*([\{\}:;,>~\+])\s*/g, '$1');
// 4. Remove trailing semicolons in blocks
content = content.replace(/;\}/g, '}');
// 5. Ensure media query keywords retain proper spacing
content = content.replace(/\)and\(/g, ') and (').replace(/\)or\(/g, ') or (');
content = content.trim();

const target = path.join(baseDir, 'main.bundle.css');
fs.writeFileSync(target, content, 'utf8');
console.log(`Successfully generated ${target} (${(Buffer.byteLength(content) / 1024).toFixed(1)} KiB)`);

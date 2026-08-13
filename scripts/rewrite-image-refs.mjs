/**
 * Reaponta as referências /images/*.jpg|png para os .webp gerados por
 * optimize-images.mjs. Só reescreve caminhos cujo .webp existe de fato.
 *
 *   node scripts/rewrite-image-refs.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const SRC_DIR = path.join(ROOT, 'src');

const webpBasenames = new Set(
  (await readdir(IMAGES_DIR))
    .filter((f) => f.endsWith('.webp'))
    .map((f) => f.slice(0, -'.webp'.length)),
);

const files = [];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(full);
    else if (/\.(tsx?|css)$/.test(entry.name)) files.push(full);
  }
}
await collect(SRC_DIR);

let totalReplacements = 0;

for (const file of files) {
  const before = await readFile(file, 'utf8');
  let replacements = 0;

  const after = before.replace(
    /\/images\/([A-Za-z0-9._%()\- ]+)\.(jpe?g|png)/gi,
    (whole, base) => {
      if (!webpBasenames.has(base)) return whole;
      replacements += 1;
      return `/images/${base}.webp`;
    },
  );

  if (replacements > 0) {
    await writeFile(file, after);
    totalReplacements += replacements;
    console.log(`${path.relative(ROOT, file)} — ${replacements} referência(s)`);
  }
}

console.log(`\n${totalReplacements} referências reapontadas para .webp`);

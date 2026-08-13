/**
 * Converte para WebP as imagens que a landing page realmente usa.
 *
 * A pasta public/images herdou ~33 MB de exports do WordPress: PNGs de
 * fotografia com 1 MB, versões em múltiplos tamanhos, arquivos órfãos.
 * Este script pega só o que está referenciado no código, redimensiona para a
 * largura em que a imagem é de fato exibida (com folga para telas 2x) e grava
 * um .webp ao lado do original.
 *
 * Os originais não são apagados — servem de fallback e de fonte para uma nova
 * geração se as larguras mudarem.
 *
 *   node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');
const SRC_DIR = path.join(ROOT, 'src');

/** Largura máxima por papel da imagem (já considerando telas 2x). */
const WIDTH_RULES = [
  [/^(visa|mastercard|pix-106-1)\./, 240], // selos de pagamento, exibidos a ~40px
  [/^(ana-paula|joao-silva|augusto-oliveira)\./, 160], // avatares 64px
  [/^(logoJL-1|logo-jl-branca-1)\./, 400], // logos, exibidos a ~220px
  [/^side-view-of-/, 1600], // hero, ocupa metade da tela em desktop
  [/^serv-/, 800], // cards de serviço (h-44) + modal
  [/^about-/, 1100], // bloco "sobre"
];
const DEFAULT_WIDTH = 1000;

function targetWidth(basename) {
  for (const [pattern, width] of WIDTH_RULES) {
    if (pattern.test(basename)) return width;
  }
  return DEFAULT_WIDTH;
}

/**
 * Varre o src atrás de todo caminho /images/... citado no código.
 *
 * Depois da primeira execução o código aponta para .webp, então o basename é
 * o que importa — o arquivo-fonte (jpg/png/webp original) é resolvido depois.
 */
async function findReferencedImages() {
  const referenced = new Set();
  const pattern = /\/images\/([A-Za-z0-9._%()\- ]+\.(?:jpe?g|png|webp))/gi;

  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (/\.(tsx?|css|html)$/.test(entry.name)) {
        const content = await readFile(full, 'utf8');
        for (const match of content.matchAll(pattern)) referenced.add(match[1]);
      }
    }
  }

  await walk(SRC_DIR);
  const indexHtml = await readFile(path.join(ROOT, 'index.html'), 'utf8');
  for (const match of indexHtml.matchAll(pattern)) referenced.add(match[1]);

  return [...referenced].sort();
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function main() {
  const referenced = await findReferencedImages();
  let totalBefore = 0;
  let totalAfter = 0;
  const missing = [];
  const rows = [];

  for (const name of referenced) {
    const basename = name.replace(/\.[^.]+$/, '');

    // Sempre reconverte a partir do original de maior qualidade disponível;
    // recomprimir um .webp já comprimido degrada a imagem a cada execução.
    let source;
    let originalSize;
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const candidate = path.join(IMAGES_DIR, `${basename}.${ext}`);
      try {
        originalSize = (await stat(candidate)).size;
        source = candidate;
        break;
      } catch {
        // tenta a próxima extensão
      }
    }

    if (!source) {
      missing.push(name);
      continue;
    }

    const width = targetWidth(name);
    const output = path.join(IMAGES_DIR, `${basename}.webp`);

    const buffer = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toBuffer();

    await writeFile(output, buffer);

    const { width: outWidth, height: outHeight } = await sharp(buffer).metadata();
    totalBefore += originalSize;
    totalAfter += buffer.length;
    rows.push({ name, originalSize, newSize: buffer.length, outWidth, outHeight });
  }

  const pad = Math.max(...rows.map((r) => r.name.length));
  console.log('\nimagem'.padEnd(pad + 2) + 'antes'.padStart(10) + 'depois'.padStart(10) + '  dimensões');
  console.log('-'.repeat(pad + 34));
  for (const r of rows) {
    console.log(
      r.name.padEnd(pad + 2) +
        kb(r.originalSize).padStart(10) +
        kb(r.newSize).padStart(10) +
        `  ${r.outWidth}x${r.outHeight}`,
    );
  }

  console.log('-'.repeat(pad + 34));
  console.log(
    'TOTAL'.padEnd(pad + 2) + kb(totalBefore).padStart(10) + kb(totalAfter).padStart(10),
  );
  console.log(
    `\n${rows.length} imagens convertidas — redução de ${(100 - (totalAfter / totalBefore) * 100).toFixed(1)}%`,
  );

  await writeManifest();

  if (missing.length) {
    console.log(`\n⚠  Referenciadas no código mas inexistentes em public/images:`);
    for (const name of missing) console.log(`   ${name}`);
  }
}

/**
 * Grava a lista de imagens que têm versão .webp.
 *
 * Documentos antigos no Firestore (portfólio, imagens de seção) guardam
 * caminhos como /images/foo.jpg. Como não dá para reescrever o banco a partir
 * do build, o app consulta este manifesto em runtime e troca pelo .webp quando
 * existe um equivalente.
 */
async function writeManifest() {
  const basenames = (await readdir(IMAGES_DIR))
    .filter((f) => f.endsWith('.webp'))
    .map((f) => f.slice(0, -'.webp'.length))
    .sort();

  const contents = `// GERADO POR scripts/optimize-images.mjs — não editar à mão.
// Basenames em public/images que possuem uma versão .webp.

export const OPTIMIZED_IMAGE_BASENAMES: ReadonlySet<string> = new Set([
${basenames.map((n) => `  ${JSON.stringify(n)},`).join('\n')}
]);
`;

  const target = path.join(SRC_DIR, 'data', 'optimizedImages.ts');
  await writeFile(target, contents);
  console.log(`\nManifesto: src/data/optimizedImages.ts (${basenames.length} imagens)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

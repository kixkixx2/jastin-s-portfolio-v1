/**
 * Resize and compress portfolio images in public/assets and assets/.
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIRS = ['public/assets', 'assets'];

const MAX_WIDTH = {
  photo: 1600,
  screenshot: 1400,
  hero: 1200,
};

function getMaxWidth(relPath) {
  if (/profile|jastin/i.test(relPath)) return MAX_WIDTH.hero;
  if (/intern|cert|TOR|diploma|honor|graduate|recognition|elegibility/i.test(relPath)) return MAX_WIDTH.photo;
  return MAX_WIDTH.screenshot;
}

/** Photo PNGs compress much better as JPEG */
function shouldConvertPngToJpeg(relPath, meta) {
  const normalized = relPath.replace(/\\/g, '/');
  if (/^intern\/[234]\.png$/i.test(normalized)) return true;
  // Large PNG screenshots without transparency
  if (/\.png$/i.test(normalized) && meta.width * meta.height > 500000 && !meta.hasAlpha) return true;
  return false;
}

async function optimizeFile(filePath, relPath) {
  const ext = path.extname(filePath).toLowerCase();
  const maxWidth = getMaxWidth(relPath);
  const before = fs.statSync(filePath).size;

  let pipeline = sharp(filePath);
  const meta = await pipeline.metadata();

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  const convertToJpeg = ext === '.png' && shouldConvertPngToJpeg(relPath, meta);

  if (convertToJpeg) {
    const jpegPath = filePath.replace(/\.png$/i, '.jpg');
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(jpegPath + '.tmp');
    fs.renameSync(jpegPath + '.tmp', jpegPath);
    if (jpegPath !== filePath) fs.unlinkSync(filePath);
    const after = fs.statSync(jpegPath).size;
    return { before, after, converted: true, output: jpegPath };
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(filePath + '.tmp');
  } else if (ext === '.png') {
    await pipeline.png({ quality: 80, compressionLevel: 9, palette: meta.hasAlpha }).toFile(filePath + '.tmp');
  } else {
    return null;
  }

  fs.renameSync(filePath + '.tmp', filePath);
  const after = fs.statSync(filePath).size;
  return { before, after, converted: false, output: filePath };
}

async function walk(dir, baseDir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(full, baseDir)));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const rel = path.relative(baseDir, full);
      results.push({ full, rel });
    }
  }
  return results;
}

let totalBefore = 0;
let totalAfter = 0;
const conversions = [];

for (const dir of DIRS) {
  const absDir = path.join(ROOT, dir);
  if (!fs.existsSync(absDir)) continue;

  const files = await walk(absDir, absDir);
  for (const { full, rel } of files) {
    try {
      const result = await optimizeFile(full, rel);
      if (!result) continue;
      totalBefore += result.before;
      totalAfter += result.after;
      const pct = ((1 - result.after / result.before) * 100).toFixed(0);
      const name = result.converted ? `${rel} → ${path.basename(result.output)}` : rel;
      console.log(`  ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB (-${pct}%)  ${name}`);
      if (result.converted) conversions.push({ from: rel.replace(/\\/g, '/'), to: path.basename(result.output) });
    } catch (err) {
      console.error(`  FAILED ${rel}:`, err.message);
    }
  }
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
if (conversions.length) {
  console.log('\nConverted PNG → JPEG (update data.ts paths):');
  conversions.forEach(({ from, to }) => console.log(`  ${from} → ${to}`));
}

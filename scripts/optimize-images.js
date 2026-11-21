import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const INPUT_DIR = path.resolve('src/assets/images/raw');
const OUTPUT_DIR = path.resolve('public/assets/images');
const WIDTHS = [400, 800];

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const files = await fs.readdir(INPUT_DIR);
  const sources = files.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));

  let rawTotal = 0;
  let optimizedTotal = 0;

  for (const file of sources) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.parse(file).name;
    const rawStat = await fs.stat(inputPath);
    rawTotal += rawStat.size;

    for (const width of WIDTHS) {
      const pipeline = sharp(inputPath).resize({ width, withoutEnlargement: true });

      const avifOut = path.join(OUTPUT_DIR, `${baseName}-${width}.avif`);
      const webpOut = path.join(OUTPUT_DIR, `${baseName}-${width}.webp`);
      const jpgOut = path.join(OUTPUT_DIR, `${baseName}-${width}.jpg`);

      await pipeline.clone().avif({ quality: 62 }).toFile(avifOut);
      await pipeline.clone().webp({ quality: 80 }).toFile(webpOut);
      await pipeline.clone().jpeg({ quality: 84, mozjpeg: true }).toFile(jpgOut);

      for (const out of [avifOut, webpOut, jpgOut]) {
        const st = await fs.stat(out);
        optimizedTotal += st.size;
      }
    }
  }

  console.log(`Processed ${sources.length} source images into AVIF, WebP, and JPEG (400w & 800w).`);
  console.log(`Raw PNGs total: ${(rawTotal / 1024).toFixed(1)} KB`);
  console.log(`All generated variants total: ${(optimizedTotal / 1024).toFixed(1)} KB`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

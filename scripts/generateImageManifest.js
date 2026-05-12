import { readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicImagesDir = resolve(__dirname, '../public/images');
const manifestPath = resolve(__dirname, '../src/utils/imageManifest.ts');

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const createManifest = async () => {
  const files = await readdir(publicImagesDir);
  const imageFiles = files.filter((file) => ALLOWED_EXTENSIONS.includes(file.slice(file.lastIndexOf('.')).toLowerCase()));

  const entries = imageFiles
    .sort()
    .map((file, index) => {
      const id = `img-${index + 1}`;
      return `  { id: '${id}', src: '/images/${file}', alt: 'Background ${index + 1}' }`;
    });

  const content = `// This file is generated automatically from public/images
// Run \"npm run generate-image-manifest\" to refresh the list.

export interface BackgroundImage {
  id: string;
  src: string;
  alt: string;
}

export const imageManifest: BackgroundImage[] = [
${entries.join(',\n')}
];
`;

  await writeFile(manifestPath, content, 'utf8');
  console.log(`Generated image manifest with ${entries.length} images.`);
};

createManifest().catch((error) => {
  console.error('Failed to generate image manifest:', error);
  process.exit(1);
});
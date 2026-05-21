import { cpSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const srcAssets: string[] = ['devtools.html', 'sidebar.html', 'manifest.json'];

for (const file of srcAssets) {
  copyFileSync(resolve(root, 'src', file), resolve(dist, file));
}

cpSync(resolve(root, 'icons'), resolve(dist, 'icons'), { recursive: true });

console.log('Assets copied to dist/');

const fs = require('fs');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'dist');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// HTML files from src/
for (const f of ['devtools.html', 'sidebar.html', 'manifest.json']) {
  fs.copyFileSync(path.resolve(__dirname, '..', 'src', f), path.join(dist, f));
}

// lib/ (turndown.js)
copyDir(path.resolve(__dirname, '..', 'lib'), path.join(dist, 'lib'));

// icons/
copyDir(path.resolve(__dirname, '..', 'icons'), path.join(dist, 'icons'));

console.log('Assets copied to dist/');

const fs = require('fs');
const path = require('path');

const srcDir = '/home/hunain/.gemini/antigravity/brain/a05b7cfa-75a6-4350-aa33-fe9cfe394b16/';
const destDir = path.join(__dirname, 'public', 'images');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.png')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    // Let's also rename them to something nicer
    if (file.includes('landing_hero')) fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'landing_hero.png'));
    if (file.includes('listing_image_1')) fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'listing_image_1.png'));
    if (file.includes('listing_image_2')) fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'listing_image_2.png'));
    if (file.includes('listing_image_3')) fs.copyFileSync(path.join(srcDir, file), path.join(destDir, 'listing_image_3.png'));
  }
});
console.log('Images copied');

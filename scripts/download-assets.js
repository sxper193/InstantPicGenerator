const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete the file async. (But we don't check the result)
      reject(err.message);
    });
  });
};

// 一张可爱的亚洲女孩真人照片 (来自 Unsplash Source，每次可能不同，但通常质量不错)
// 使用固定的 ID 以保证一致性
const originalUrl = 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?q=80&w=1000&auto=format&fit=crop'; 
const dest = path.join(__dirname, '../public/sample-original.png');

console.log('Downloading sample original photo...');
download(originalUrl, dest)
  .then(() => console.log('Done! Saved to public/sample-original.png'))
  .catch(err => console.error('Error downloading:', err));


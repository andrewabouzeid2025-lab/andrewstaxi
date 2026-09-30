import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function test() {
  try {
    const imgPath = 'C:\\Users\\tonys\\.gemini\\antigravity-ide\\brain\\511c6a58-24d2-482c-bc8c-e32eec59f2c7\\byblos_batroun_taxi_1790779213788.jpg';
    console.log('Reading generated image from', imgPath);
    const buffer = fs.readFileSync(imgPath);
    console.log('Image read.');

    const logoPath = path.join(process.cwd(), 'public', 'logo-white.png');
    console.log('Reading logo from', logoPath);
    const logoBuffer = await sharp(logoPath).resize({ width: 250 }).toBuffer();
    console.log('Logo read.');

    const finalBuffer = await sharp(buffer)
      .composite([{ input: logoBuffer, gravity: 'southeast' }])
      .toBuffer();
    
    fs.mkdirSync(path.join(process.cwd(), 'public', 'images'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), 'public', 'images', 'autumn-day-trip-from-beirut-byblos-and-batroun-with-a-private-driver.jpg'), finalBuffer);
    
    console.log('Beautiful image composited and saved successfully.');
  } catch (e) {
    console.error('Error:', e);
  }
}

test();

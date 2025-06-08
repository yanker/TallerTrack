import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_ICON = './public/web-app-manifest-512x512.png';
const OUTPUT_DIR = './public/splashscreens';

const devices = [
  { name: 'iPhone_14_Pro_Max', width: 2796, height: 1290 },
  { name: 'iPhone_14_Pro', width: 2556, height: 1179 },
  { name: 'iPhone_14_Plus', width: 2778, height: 1284 },
  { name: 'iPhone_14', width: 2532, height: 1170 },
  { name: 'iPhone_13_mini', width: 2340, height: 1080 },
  { name: 'iPhone_11_Pro_Max', width: 2688, height: 1242 },
  { name: 'iPhone_11', width: 1792, height: 828 },
  { name: 'iPhone_8_Plus', width: 2208, height: 1242 },
  { name: 'iPhone_8', width: 1334, height: 750 },
  { name: 'iPhone_SE', width: 1136, height: 640 },
  { name: 'iPad_Pro_12.9', width: 2732, height: 2048 },
  { name: 'iPad_Pro_11', width: 2388, height: 1668 },
  { name: 'iPad_Air', width: 2360, height: 1640 },
  { name: 'iPad_10.5', width: 2224, height: 1668 },
  { name: 'iPad_10.2', width: 2160, height: 1620 },
  { name: 'iPad_9.7', width: 2048, height: 1536 },
  { name: 'iPad_Mini', width: 2266, height: 1488 },
];

async function generateSplashScreens() {
  try {
    // Crear el directorio de salida si no existe
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    for (const device of devices) {
      const output = path.join(OUTPUT_DIR, `${device.name}_landscape.png`);

      await sharp(SOURCE_ICON)
        .resize({
          width: device.width,
          height: device.height,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255 },
        })
        .toFile(output);

      console.log(`Generated ${output}`);
    }

    console.log('All splash screens generated successfully!');
  } catch (error) {
    console.error('Error generating splash screens:', error);
  }
}

generateSplashScreens();

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const sourceImage = 'assets/images/slider/original-slide.jpg';
const desktopOutput = 'assets/images/slider/slide-1.webp';
const mobileOutput = 'assets/images/slider/slide-1-mobile.webp';
const desktopWidth = 1920;
const mobileWidth = 768;
const desktopQuality = 82;
const mobileQuality = 80;

async function optimizeHeroImage() {
  try {
    console.log('Starting hero image optimization...');
    
    // Check if source image exists
    if (!fs.existsSync(sourceImage)) {
      console.error(`Error: Source image '${sourceImage}' not found.`);
      console.log('Please place your original high-quality image as:', sourceImage);
      process.exit(1);
    }

    // Generate desktop version
    console.log(`Generating desktop version (${desktopWidth}px wide, quality ${desktopQuality})...`);
    await sharp(sourceImage)
      .resize(desktopWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: desktopQuality })
      .toFile(desktopOutput);
    console.log(`✓ Desktop version saved: ${desktopOutput}`);

    // Generate mobile version
    console.log(`Generating mobile version (${mobileWidth}px wide, quality ${mobileQuality})...`);
    await sharp(sourceImage)
      .resize(mobileWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: mobileQuality })
      .toFile(mobileOutput);
    console.log(`✓ Mobile version saved: ${mobileOutput}`);

    // Get file sizes
    const desktopSize = (fs.statSync(desktopOutput).size / 1024).toFixed(2);
    const mobileSize = (fs.statSync(mobileOutput).size / 1024).toFixed(2);

    console.log('\n=== Optimization Complete ===');
    console.log(`Desktop: ${desktopSize} KB`);
    console.log(`Mobile:  ${mobileSize} KB`);
    console.log('\nImages are ready for production use!');
    
  } catch (error) {
    console.error('Error during optimization:', error.message);
    process.exit(1);
  }
}

optimizeHeroImage();

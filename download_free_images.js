// Script to download free stock donut images
const fs = require('fs');
const path = require('path');
const https = require('https');

// List of image names we need
const imageNames = [
  'premium-donuts.jpg',
  'mini-donuts.jpg',
  'buns.jpg',
  'drinks.jpg',
  'hero-bg.jpg',
  'franchise-bg.jpg',
  'chocolate-donut.jpg',
  'strawberry-donut.jpg',
  'caramel-donut.jpg',
  'matcha-donut.jpg',
  'blueberry-donut.jpg',
  'oreo-donut.jpg',
  'mini-chocolate.jpg',
  'mini-glazed.jpg',
  'mini-assorted.jpg',
  'cream-bun.jpg',
  'red-bean-bun.jpg',
  'chocolate-bun.jpg',
  'coffee.jpg',
  'menu-hero.jpg',
  'milk-tea.jpg',
  'lemonade.jpg',
  'contact-hero.jpg'
];

// Updated free stock image URLs from Unsplash with more reliable links
const freeImageUrls = [
  'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6', // premium-donuts
  'https://images.unsplash.com/photo-1631397833242-fc6213046352', // mini-donuts
  'https://images.unsplash.com/photo-1586444248902-2981d3a8b963', // buns
  'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8', // drinks
  'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6', // hero-bg
  'https://images.unsplash.com/photo-1608296628790-c540da389b7c', // franchise-bg
  'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6', // chocolate-donut
  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd', // strawberry-donut
  'https://images.unsplash.com/photo-1556912998-c57cc6b1aa88', // caramel-donut
  'https://images.unsplash.com/photo-1646555494938-f787f4807f0f', // matcha-donut
  'https://images.unsplash.com/photo-1612240498936-65f5101365d2', // blueberry-donut
  'https://images.unsplash.com/photo-1608296628790-c540da389b7c', // oreo-donut
  'https://images.unsplash.com/photo-1581380876109-f718376c1120', // mini-chocolate
  'https://images.unsplash.com/photo-1527904324834-3bda86da6771', // mini-glazed
  'https://images.unsplash.com/photo-1634118520179-0c78b72df69a', // mini-assorted
  'https://images.unsplash.com/photo-1606131731446-5568d87113aa', // cream-bun
  'https://images.unsplash.com/photo-1568254183919-78a4f43a2877', // red-bean-bun
  'https://images.unsplash.com/photo-1621041807745-132a04ff2656', // chocolate-bun
  'https://images.unsplash.com/photo-1541167760496-1628856ab772', // coffee
  'https://images.unsplash.com/photo-1620921575116-fb8902686a84', // menu-hero
  'https://images.unsplash.com/photo-1558857563-b371033873b8', // milk-tea
  'https://images.unsplash.com/photo-1621263764928-df1444c5e859', // lemonade
  'https://images.unsplash.com/photo-1516476892398-bdcab4c8dab8'  // contact-hero
];

// Make sure we have enough free image URLs
if (freeImageUrls.length < imageNames.length) {
  console.error('Not enough free image URLs for all the needed images');
  process.exit(1);
}

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log('Created images directory');
}

// Function to download an image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    // Add parameters to get a properly sized image
    const fullUrl = `${url}?w=800&h=600&fit=crop&crop=entropy&q=80`;
    
    console.log(`Downloading: ${fullUrl} -> ${filename}`);
    
    https.get(fullUrl, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
        const redirectUrl = response.headers.location;
        console.log(`Redirected to: ${redirectUrl}`);
        
        if (!redirectUrl) {
          reject(new Error(`Redirect without location header. Status: ${response.statusCode}`));
          return;
        }
        
        // Follow the redirect
        https.get(redirectUrl, (redirectResponse) => {
          if (redirectResponse.statusCode !== 200) {
            reject(new Error(`Failed to download image after redirect. Status: ${redirectResponse.statusCode}`));
            return;
          }
          
          const fileStream = fs.createWriteStream(filename);
          redirectResponse.pipe(fileStream);
          
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
          
          fileStream.on('error', (err) => {
            fs.unlink(filename, () => {}); // Delete the file if error occurs
            reject(err);
          });
        }).on('error', (err) => {
          reject(err);
        });
      } else if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image. Status Code: ${response.statusCode}`));
        return;
      } else {
        // No redirect, proceed normally
        const fileStream = fs.createWriteStream(filename);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filename, () => {}); // Delete the file if error occurs
          reject(err);
        });
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('Starting to download free stock images...');
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < imageNames.length; i++) {
    const imageName = imageNames[i];
    const imageUrl = freeImageUrls[i];
    const imagePath = path.join(imagesDir, imageName);
    
    try {
      await downloadImage(imageUrl, imagePath);
      console.log(`Downloaded ${imageName} successfully`);
      successCount++;
    } catch (error) {
      console.error(`Error downloading ${imageName}: ${error.message}`);
      failCount++;
      
      // Create a fallback SVG if download fails
      createFallbackSvg(imageName);
    }
  }
  
  console.log(`Download summary: ${successCount} successes, ${failCount} failures`);
  console.log('IMPORTANT: These images are from Unsplash and are free to use.');
  console.log('However, it\'s good practice to attribute the photographers when possible.');
}

// Create a fallback SVG for failed downloads
function createFallbackSvg(imageName) {
  const name = path.basename(imageName, path.extname(imageName));
  const svgPath = path.join(imagesDir, name + '.svg');
  
  // Determine color based on filename
  let color = '#FFA500'; // Default orange
  if (name.includes('donut')) color = '#FF7F50';
  if (name.includes('chocolate')) color = '#8B4513';
  if (name.includes('strawberry')) color = '#FF69B4';
  if (name.includes('bun')) color = '#CD853F';
  if (name.includes('coffee')) color = '#6F4E37';
  if (name.includes('hero') || name.includes('bg')) color = '#4682B4';
  
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="${color}" />
    <text x="50%" y="50%" font-family="Arial" font-size="30" text-anchor="middle" fill="white">${name.replace(/-/g, ' ')}</text>
  </svg>`;
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`Created fallback SVG for ${imageName}`);
}

// Run the download
downloadAllImages().catch(console.error); 
// Script to generate SVGs for all required images
const fs = require('fs');
const path = require('path');

// List of all image names we need
const imageNames = [
  'premium-donuts',
  'mini-donuts',
  'buns',
  'drinks',
  'hero-bg',
  'franchise-bg',
  'chocolate-donut',
  'strawberry-donut',
  'caramel-donut',
  'matcha-donut',
  'blueberry-donut',
  'oreo-donut',
  'mini-chocolate',
  'mini-glazed',
  'mini-assorted',
  'cream-bun',
  'red-bean-bun',
  'chocolate-bun',
  'coffee',
  'menu-hero',
  'milk-tea',
  'lemonade',
  'contact-hero'
];

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
  console.log('Created images directory');
}

// Generate a simple SVG placeholder based on filename
function generatePlaceholderSVG(basename) {
  // Choose a color based on the filename
  let bgColor = '#f7a046'; // Default orange
  if (basename.includes('donut')) bgColor = '#ff7f50';
  if (basename.includes('chocolate')) bgColor = '#8b4513';
  if (basename.includes('strawberry')) bgColor = '#ff69b4';
  if (basename.includes('bun')) bgColor = '#cd853f';
  if (basename.includes('coffee') || basename.includes('tea')) bgColor = '#6f4e37';
  if (basename.includes('hero') || basename.includes('bg')) bgColor = '#4682b4';
  if (basename.includes('contact')) bgColor = '#5f9ea0';
  
  // Format the text
  const text = basename.replace(/-/g, ' ');
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="400" y="300" font-family="Arial" font-size="36" font-weight="bold" 
      text-anchor="middle" dominant-baseline="middle" fill="white">${text}</text>
  </svg>`;
}

// Generate SVGs for all required images
function generateAllSVGs() {
  console.log('Generating SVG images for all required files...');
  let count = 0;
  
  imageNames.forEach(name => {
    const svgPath = path.join(imagesDir, `${name}.svg`);
    const svgContent = generatePlaceholderSVG(name);
    
    fs.writeFileSync(svgPath, svgContent);
    count++;
    console.log(`Created SVG: ${svgPath}`);
  });
  
  console.log(`Successfully generated ${count} SVG images`);
}

// Run the generation
generateAllSVGs(); 
const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create Express app
const app = express();

// Serve static files from the current directory
app.use(express.static('.'));

// For fallback SVG images when JPG/JPEG files are missing
app.use((req, res, next) => {
  const filePath = '.' + req.url;
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // If this is a JPEG/JPG request
  if ((extname === '.jpg' || extname === '.jpeg') && !fs.existsSync(filePath)) {
    // Try to serve SVG instead
    const svgPath = filePath.replace(/\.jpe?g$/, '.svg');
    
    if (fs.existsSync(svgPath)) {
      // SVG exists, serve it
      return res.type('image/svg+xml').sendFile(path.resolve(svgPath));
    } else {
      // Generate inline SVG
      const basename = path.basename(filePath, extname);
      const inlineSvg = generatePlaceholderSVG(basename);
      return res.type('image/svg+xml').send(inlineSvg);
    }
  }
  
  // Continue to next middleware
  next();
});

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

// Get all network interfaces to show IP addresses
function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      addresses.push(iface.address);
    }
  }
  
  return addresses;
}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  const ipAddresses = getNetworkInterfaces();
  
  console.log("\n===== YOUR DONUT HAVEN WEBSITE IS RUNNING =====");
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Local network access (for other computers):`);
  
  ipAddresses.forEach(ip => {
    console.log(`http://${ip}:${PORT}`);
  });
  
  console.log("\n=== INSTRUCTIONS FOR INTERNET ACCESS ===");
  console.log("For temporary access from anywhere:");
  console.log("1. Install localtunnel: npm install -g localtunnel");
  console.log("2. In another terminal window run: lt --port 8080");
  console.log("3. Share the URL it provides");
  console.log("\nOr try port forwarding on your router:");
  console.log("1. Forward external port 8080 to internal port 8080 at IP", ipAddresses[0]);
  console.log("2. Find your public IP at https://whatismyip.com");
  console.log("3. Share http://[your-public-IP]:8080");
}); 
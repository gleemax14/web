// Simple HTTP server that will definitely work
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const server = http.createServer((req, res) => {
  console.log(`Request received for: ${req.url}`);
  
  // For the root path, serve index.html
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Determine content type
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  
  const contentType = contentTypes[extname] || 'text/plain';
  
  // Attempt to read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      // If JPG/JPEG file is requested but not found, try SVG instead
      if ((extname === '.jpg' || extname === '.jpeg') && error.code === 'ENOENT') {
        const svgPath = filePath.replace(/\.jpe?g$/, '.svg');
        
        fs.readFile(svgPath, (svgError, svgContent) => {
          if (svgError) {
            // If SVG also not found, create an inline SVG
            const basename = path.basename(filePath, extname);
            const inlineSvg = generatePlaceholderSVG(basename);
            
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(inlineSvg);
            console.log(`Generated inline SVG for missing file: ${filePath}`);
          } else {
            // SVG found, serve it
            res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
            res.end(svgContent);
            console.log(`Served SVG instead of missing JPG: ${svgPath}`);
          }
        });
      } else {
        // For all other file types, serve a 404 if not found
        res.writeHead(404);
        res.end(`File not found: ${filePath}`);
      }
    } else {
      // File was found, serve it
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
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
const port = 8080;
server.listen(port, '0.0.0.0', () => {
  const ipAddresses = getNetworkInterfaces();
  
  console.log("\n===== YOUR DONUT HAVEN WEBSITE IS RUNNING =====");
  console.log(`Local access: http://localhost:${port}`);
  console.log(`Local network access (for other computers):`);
  
  ipAddresses.forEach(ip => {
    console.log(`http://${ip}:${port}`);
  });
  
  console.log("\n=== INSTRUCTIONS FOR OTHERS TO ACCESS THE SITE ===");
  console.log("1. They must be connected to the same network as this computer");
  console.log("2. They should open a web browser (Chrome, Firefox, etc.)");
  console.log("3. They should type one of the network addresses shown above");
  console.log("4. If it doesn't work, check your Windows firewall settings");
  console.log("5. Press Ctrl+C to stop the server");
}); 
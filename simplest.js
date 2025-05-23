// Simple HTTP server without any dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request received for: ${req.url}`);
  
  // For the root path, serve index.html
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Define content types based on file extension
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

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - try fallbacks
        console.log(`File not found: ${filePath}`);
        
        // Fallback logic:
        // 1. If JPG not found, try SVG
        // 2. If SVG not found, try HTML embedding SVG
        if (extname === '.jpg' || extname === '.jpeg') {
          const svgPath = filePath.replace(/\.jpe?g$/, '.svg');
          
          fs.readFile(svgPath, (svgError, svgContent) => {
            if (svgError) {
              // SVG not found, serve a generic placeholder
              servePlaceholder(req, res, path.basename(filePath, extname));
            } else {
              // SVG found, serve it
              res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
              res.end(svgContent, 'utf-8');
              console.log(`Served SVG fallback for: ${filePath}`);
            }
          });
        } else {
          // Not an image or no fallback available
          res.writeHead(404);
          res.end('File not found');
        }
      } else {
        // Server error
        console.log(`Server error: ${error.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Serve a generic placeholder based on the filename
function servePlaceholder(req, res, basename) {
  console.log(`Generating placeholder for: ${basename}`);
  
  // Determine placeholder color based on filename
  let bgColor = '#FFA500'; // Default orange
  let text = basename.replace(/-/g, ' ');
  
  // Set different colors for different types of items
  if (basename.includes('donut')) bgColor = '#FF7F50';
  if (basename.includes('chocolate')) bgColor = '#8B4513';
  if (basename.includes('strawberry')) bgColor = '#FF69B4';
  if (basename.includes('bun')) bgColor = '#CD853F';
  if (basename.includes('coffee')) bgColor = '#6F4E37';
  if (basename.includes('hero') || basename.includes('bg')) bgColor = '#4682B4';
  
  // Generate SVG placeholder
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="${bgColor}" />
    <text x="50%" y="50%" font-family="Arial" font-size="30" text-anchor="middle" fill="white">${text}</text>
  </svg>
  `;
  
  res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
  res.end(svg, 'utf-8');
  console.log(`Served generated placeholder for: ${basename}`);
}

const port = 5000;

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Also try http://127.0.0.1:${port}`);
  console.log(`The website now uses real images and SVG fallbacks!`);
}); 
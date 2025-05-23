// Simple static file server using Node.js
// To use this server:
// 1. Make sure Node.js is installed
// 2. Run "npm install express" in the terminal
// 3. Run "node server.js" to start the server
// 4. Access your website at http://localhost:3000

const express = require('express');
const app = express();
const port = 8080;

// Serve static files from the current directory
app.use(express.static('./'));

// Add a route to test the server
app.get('/api/test', (req, res) => {
  res.json({ status: 'Server is working' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Donut Haven website running at http://localhost:${port}`);
  console.log(`Also try http://127.0.0.1:${port}`);
  console.log(`Press Ctrl+C to stop the server`);
}); 
require('dotenv').config();
const http = require('http');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const server = http.createServer((req, res) => {
  console.log('Received request: ' + req.method + ' ' + req.url);

  // Set CORS headers to allow requests from any domain
  res.writeHead(200, corsHeaders);

  // Check for request method and URL
  if (req.method === 'POST') {
    // Read the request body and make a POST request to the target server
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });

    req.on('end', () => {
      console.log('Proxying request: ' + JSON.stringify(requestBody));

      const options = {
        hostname: '127.0.0.1',
        port: process.env.NODE_PORT || 26658,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': requestBody.length,
          'Authorization': req.headers['authorization'] || '',
        },
      };

      const proxyReq = http.request(options, (proxyRes) => {
        // Send the response from the target server back to the client
        proxyRes.on('data', (chunk) => {
          console.log('Received response: ' + chunk.toString('utf-8'));
          res.write(chunk);
        });

        proxyRes.on('end', () => {
          console.log('Proxying finished');
          res.end();
        });
      });

      // Send the request body to the target server
      proxyReq.write(requestBody);
      proxyReq.end();
    });
  } else {
    // Return 404 status for unsupported requests
    res.statusCode = 404;
    res.end();
  }
});

server.listen(5002, () => {
  console.log('Proxy server started on port 5002');
});
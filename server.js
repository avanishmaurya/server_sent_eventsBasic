const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to send SSE
app.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',   // SSE content type
    'Cache-Control': 'no-cache',           // Disable caching
    'Connection': 'keep-alive'             // Keep the connection open
  });
   console.log("a client is connected")

   const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };
  
  // Send a message every 5 seconds
  const interval = setInterval(() => {
    const eventData = {
      message: 'Hello world!',
      timestamp: new Date().toLocaleTimeString()
    };
    sendEvent(eventData);
  }, 5000);
  
  // Clean up when the client closes the connection
  req.on('close', () => {
    clearInterval(interval);
    console.log("a client is disconnected")
    res.end();
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

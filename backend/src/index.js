const http = require("http");
const app = require("./app");
const setupWebSocket = require("./websocket");

const server = http.createServer(app);

// Initialize WebSocket
setupWebSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

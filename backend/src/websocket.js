const WebSocket = require("ws");

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established.");

    ws.on("message", (message) => {
      console.log("Received message:", message);

      // Handle audio data or commands
      ws.send("Message received!");
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed.");
    });
  });
};

module.exports = setupWebSocket;

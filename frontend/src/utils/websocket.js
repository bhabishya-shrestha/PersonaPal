let ws;

export const connectWebSocket = () => {
  ws = new WebSocket("ws://localhost:5000");
  ws.onopen = () => console.log("WebSocket connected.");
  ws.onclose = () => console.log("WebSocket disconnected.");
  ws.onerror = (error) => console.error("WebSocket error:", error);

  ws.onmessage = (event) => {
    console.log("Message from server:", event.data);
  };
};

export const sendMessage = (message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    console.error("WebSocket is not open.");
  }
};

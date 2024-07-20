// websocket.js

// const ws = new WebSocket('ws://10.0.2.2:8000');
const ws = new WebSocket('ws://192.168.29.8:8000');

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  console.log('Received message:', event.data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket closed');
};

export default ws;

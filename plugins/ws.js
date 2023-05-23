// const http = require("http");
import { WebSocketServer } from 'ws';

export default (ctx) => {
  // const server = http.createServer({ noServer: true });
  // server.listen(8888);

  const wss = new WebSocketServer({ noServer: true });
  wss.on("connection", (ws) => {
    console.log("連線成功");
    ws.on("message", (data) => {
      console.log(data);
    });

    ws.on("close", () => {});
  });
};
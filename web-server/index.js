import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { subscribe } from "./src/consumer.js";

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
  console.log("New client connected!");

  subscribe((message) => {
    ws.send(message);
  });
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

import express from "express";
import http from "http";
import { Kafka } from "kafkajs";
import { WebSocketServer } from "ws";

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "web-pinger",
  brokers: kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: "web-pinger-v1" });
await consumer.connect();
await consumer.subscribe({ topic: "web-ping", fromBeginning: true });

const wss = new WebSocketServer({ server });

wss.on("connection", async (ws) => {
  console.log("New client connected!");
  // TODO - this can't be called by a new browser window since the consumer is already running.
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      ws.send(message.value.toString());
    },
  });
});

server.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

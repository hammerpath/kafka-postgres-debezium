import { Kafka } from "kafkajs";

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "web-pinger",
  brokers: kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: "web-pinger-v1" });
await consumer.connect();
await consumer.subscribe({ topic: "web-ping", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log("message received", {
      partition,
      offset: message.offset,
      value: message.value.toString(),
    });
  },
});

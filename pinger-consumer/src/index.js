import { Kafka } from "kafkajs";

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "pinger",
  brokers: kafkaBrokers
});

const consumer = kafka.consumer({ groupId: "pinger-v1" });
await consumer.connect();
await consumer.subscribe({ topic: "ping", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      partition,
      offset: message.offset,
      value: message.value.toString()
    });
  }
});
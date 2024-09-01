import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "pinger",
  brokers: kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: "pinger-v1" });
await consumer.connect();
await consumer.subscribe({ topic: "ping", fromBeginning: true });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    if (
      !(await prisma.ping.findUnique({
        where: { value: parseInt(message.value.toString()) },
      }))
    ) {
      const ping = await prisma.ping.create({
        data: { value: parseInt(message.value.toString()) },
      });

      console.log("added to db", ping);
    }

    console.log("message received", {
      partition,
      offset: message.offset,
      value: message.value.toString(),
    });
  },
});

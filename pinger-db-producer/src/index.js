import { Kafka } from "kafkajs";

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "cdc-pinger",
  brokers: kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: "cdc-ping-v1" });
await consumer.connect();
await consumer.subscribe({
  topic: "cdc-ping.public.Ping",
  fromBeginning: true,
});
const producer = kafka.producer();
await producer.connect();

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const jsonMessage = JSON.parse(message.value.toString());
    await producer.send({
        topic: "web-ping",
        messages: [{ value: jsonMessage.payload.after.value.toString() }],
      });
  },
});

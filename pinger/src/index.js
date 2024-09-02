import { Kafka } from "kafkajs";

const kafkaBrokers = ["kafka:9092"];

const kafka = new Kafka({
  clientId: "pinger",
  brokers: kafkaBrokers,
});
const producer = kafka.producer();
await producer.connect();

function count() {
  let i = 1;
  setInterval(async () => {
    await producer.send({
      topic: "ping",
      messages: [{ value: i.toString() }],
    });
    i++;
  }, 1000);
}

count();

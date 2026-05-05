import { ServiceBusClient } from "@azure/service-bus";

const key = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = "jobs-queue";

const client = new ServiceBusClient(key);
const sender = client.createSender(queueName);

export default async function sendToQueue(task) {
    try {
        await sender.sendMessages({
            body: task,
            messageId: task.id,
            contentType: "application/json"
        });
        console.log(task.id + " sent to queue");
    } catch (error) {
        console.log("Error during sending to queue : " + error)
    }
}
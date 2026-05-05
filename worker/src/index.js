import { ServiceBusClient } from "@azure/service-bus";
import handlers from "./handlers/index.js";
import { updateStatus } from "./queue/dynamoQueue.js";

const key = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = "jobs-queue";

const client = new ServiceBusClient(key);
const receiver = client.createReceiver(queueName);

const handler = {
    processMessage: async (msg) => {
        const task = msg.body;
        let id = task.taskId;

        try {
        await updateStatus(id, "processing");
        let handler = handlers[task.type];
        if (!handler) throw new Error("No handler function found for this task type");

        if (await handler(task.payload))
            await updateStatus(id, "completed");
        else
            await updateStatus(id, 'failed');
        } catch (err) {
            await updateStatus(id, "failed");
            throw new Error("Some Error occured \n", err);
        }
    },
    processError: async (err) => {
        console.error("Service Bus Error: ", err);
    }
}
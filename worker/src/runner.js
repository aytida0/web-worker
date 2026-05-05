// not used now as queue is now used for sending and receiving messages (tasks)

import { getPendingTasks, getFailedTasks, updateStatus } from "./queue/dynamoQueue.js";
import handlers from "./handlers/index.js";

export default async function run() {
    const pendingTasks = await getPendingTasks();

    pendingTasks.forEach( async task => {
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
            console.log("Some Error occured \n", err);
            await updateStatus(id, "failed");
        }
    });

    if (pendingTasks.length == 0)
        interval = Math.min(interval*2, 30000);
    else
        interval = 5000;
}

export default async function retry() {
    const failedTasks = await getFailedTasks();

    failedTasks.forEach( async task => {
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
            console.log("Some Error occured \n", err);
            await updateStatus(id, "failed");
        }
    });

    if (pendingTasks.length == 0)
        retryInterval = Math.min(retryInterval*2, 90000);
    else
        retryInterval = 5000;
}
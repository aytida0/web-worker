import {nanoid} from 'nanoid';
import { listItems, putItem, getItem, deleteItem, createTable } from '../model/tasks.js';
import { sendToQueue } from '../model/queue.js';

const getTasks = async (req, res) => {
    // Logic to retrieve tasks from the database 
    try {
        const response = await listItems();
        res.status(200).send(response);
    } catch (err) {
        return res.send(err);
    }
}

const createTask = async (req, res) => {
    // Logic to create a new task
    const taskId = nanoid(10);
    const task = {
        taskId: taskId,
        type: req.body.type || "send_email",
        payload: {
            to: req.body.toEmail || "email",
            subject: req.body.subject || "Default Subject",
            msg: req.body.msg || "Message Body",
        },
        priority: req.body.priority || "default",
        status: "pending",
    }

    try {
        const response = await putItem(task);
        await sendToQueue(task);
        res.status(201).send({"Task Id": taskId, "Response": response});
    } catch (error) {
        console.log(error)
        res.status(500).send("Error submitting task", error);
    }
}

const getStatus = async (req, res) => {
    // Logic to check the status of a specific task by ID
    const id = req.params.taskId;
    const input = {
        TableName: "Tasks",
        Key: {
            taskId: id,
        }
    }
    try{
        const response = await getItem(input);
        if (!response.Item) 
            res.status(404).send("No item exist with that Task_Id")
        res.status(200).send(response.Item.status);
    } catch (err) {
        res.send(err);
    }
}

async function deleteTask (req, res){
    const id = req.params.taskId;
    const input = {
        TableName: "Tasks",
        Key: {
            taskId: id,
        }
    }
    try {
        const response = await deleteItem(input);
        return res.status(204).send(response);
    } catch (err) {
        res.send(err);
    }
}

const setupTable = async (req, res) => {
    try {
        createTable();
        res.send("Setup Completed");
    } catch (err) {
        res.send("Table already exists/ some error occured");
    }
}

// Export the controller functions
export { getTasks, createTask, getStatus, deleteTask, setupTable };
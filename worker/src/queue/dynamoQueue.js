import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";

const client = new DynamoDBClient({
    region: "ap-south-1",
    endpoint: "http://localhost:8000",
    credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
     }
});

const docClient = DynamoDBDocumentClient.from(client);

const getPendingTasks = async () => {
    let input = {
        TableName: "Tasks",
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": "pending",
        }
    }
    const command = new QueryCommand(input);
    const response = await docClient.send(command);
    return response.Items;
}

const getFailedTasks = async () => {
    let input = {
        TableName: "Tasks",
        IndexName: "status-index",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": "failed",
        }
    }
    const command = new QueryCommand(input);
    const response = await docClient.send(command);
    return response.Items;
}
 
const updateStatus = async (id, newStatus) => {
    let input = {
        TableName: "Tasks",
        Key: {taskId: id},
        UpdateExpression: "SET #status = :newStatus",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":newStatus": newStatus },
    }
    const command = new UpdateCommand(input);
    try {
        await docClient.send(command);
        return true;
    } catch (err) {
        return false;
    }
}

export { getPendingTasks, updateStatus };
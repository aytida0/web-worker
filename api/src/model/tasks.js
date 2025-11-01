import { DynamoDBClient, CreateTableCommand, UpdateTableCommand, ScanCommand} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand} from "@aws-sdk/lib-dynamodb";
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

export const createTable = async () => {
    const createTable = new CreateTableCommand({
        TableName: "Tasks",
        AttributeDefinitions: [
            {
                AttributeName: "taskId",
                AttributeType: "S"
            },
            {
                AttributeName: "status",
                AttributeType: "S"
            }
        ],
        KeySchema: [
            {
                AttributeName: "taskId",
                KeyType: "HASH" // Partition key
            }
        ],
        GlobalSecondaryIndexes:[
            {
                IndexName: "status-index",
                KeySchema: [
                    { AttributeName: "status", KeyType: "HASH" }
                ],
                Projection: {
                    ProjectionType: "ALL",
                },
                ProvisionedThroughput: {
                   ReadCapacityUnits: 5,
                   WriteCapacityUnits: 5
                 }
            }
        ],
        BillingMode: "PROVISIONED",
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
    });

    // const updateTable = new UpdateTableCommand({
    //     TableName: "Tasks",
    //     BillingMode: "PROVISIONED",
    //     ProvisionedThroughput: {
    //       ReadCapacityUnits: 5,
    //       WriteCapacityUnits: 5
    //     }
    // })

    const response = await client.send(createTable);
    console.log("Table created successfully:", response);
    return response;
}

export const listItems = async () => {
    const input = {
        TableName: "Tasks",
    };
    const command = new ScanCommand(input);
    const response = await docClient.send(command);
    console.log(response);
    return response;
}

export const putItem = async (input) => {
    const command = new PutCommand(input);
    const response = await docClient.send(command);
    console.log(response);
    return response;
}

export const getItem = async (input) => {
    const command = new GetCommand(input);
    const response = await docClient.send(command);
    console.log(response);
    return response;
}

export const deleteItem = async (input) => {
    const command = new DeleteCommand(input);
    const response = await docClient.send(command);
    console.log(response);
    return response;
}
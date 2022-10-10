import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamoDBClient';
import { v4 as uuidv4 } from 'uuid';

interface ICreateTodo {
    name: string;
    description: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { name, description } = JSON.parse(event.body) as ICreateTodo;
    const { userId } = event.pathParameters;
    const id = uuidv4();

    await document
        .put({
            TableName: 'todos',
            Item: {
                id,
                userId,
                name,
                description,
                created_at: new Date().getTime(),
            },
        })
        .promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo created',
            id,
            userId,
        }),
    };
};

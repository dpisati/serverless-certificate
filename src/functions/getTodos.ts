import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from '../utils/dynamoDBClient';

interface ITodos {
    id: string;
    userId: string;
    name: string;
    description: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;

    const response = await document
        .query({
            TableName: 'todos',
            IndexName: 'UserIdIndex',
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        })
        .promise();

    const todos = response.Items as ITodos[];

    if (todos) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                todos,
            }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'Invalid query',
        }),
    };
};

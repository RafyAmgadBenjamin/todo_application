import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Remove a TODO item by id
    const userId = "1"


    const result = await docClient.get({
        TableName: todosTable,
        Key: {
            todoId
        }
    }).promise()

    const todo_item = result.Item as TodoItem

    // Todo item is not found
    if (!todo_item) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }

    // User is not allowed to delete the todo
    if (todo_item.userId !== userId) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
    // Delete Item from DB
    await deleteTodoItemFromDB(todo_item.todoId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(todo_item.todoId)
    }
}


async function deleteTodoItemFromDB(todoId: String) {
    await docClient.delete({
        TableName: todosTable,
        Key: {
            todoId
        }
    }).promise()
}

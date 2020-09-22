import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'



import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // TODO: Implement creating a new TODO item 

    // TODO: update it to be read from JWT

    const userId = "1"
    // Create the new Todo item
    let newTodoItem: TodoItem;
    newTodoItem = await createSingleTodo(userId, newTodo)
    // Store the new Todo
    await storeTodoIteminDB(newTodoItem)
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: newTodoItem
        })
    }
}

async function createSingleTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    // Generate a UUID for the todo
    const todoId = uuid.v4()
    const newItem: TodoItem = {
        userId,
        todoId,
        // in ISO format (ISO 8601) i.e, in the form of (YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ)
        createdAt: new Date().toISOString(),
        //by default it will be false
        done: false,
        attachmentUrl: null,
        // Copy the rest of properties from CreatedTodoRequest to TODOItem 
        ...createTodoRequest
    }
    return newItem
}

async function storeTodoIteminDB(todoItem: TodoItem) {
    await docClient.put({
        TableName: todosTable,
        Item: todoItem
    }).promise()
}
import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
// import { TodoUpdate } from '../../models/TodoUpdate'
import { getUserId } from '../utils'
import { TodosRepository } from '../../dataLayer/todos'


// import * as AWS from 'aws-sdk'


// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    // TODO: Update the userId to be from jwt
    const userId = getUserId(event)
    let todosRepository = new TodosRepository()
    const result = await todosRepository.getTodoItem(todoId)
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

    // User is not allowed to update the todo
    if (todo_item.userId !== userId) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
    // Update todo in the DB
    await todosRepository.updateTodoItem(updatedTodo, todoId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(todo_item.todoId)
    }
}



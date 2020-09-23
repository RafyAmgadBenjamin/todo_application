import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import * as AWS from 'aws-sdk'
import { TodoItem } from '../../models/TodoItem'
import { getUserId, validateTodoItem } from '../utils'
import { TodosRepository } from '../../dataLayer/todos'



// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    // TODO: Remove a TODO item by id

    // TODO: Update the userId to be from jwt
    const userId = getUserId(event)
    let todosRepository = new TodosRepository()

    const result = await todosRepository.getTodoItem(todoId)

    const todoItem = result.Item as TodoItem

    // Validate todoItem 
    validateTodoItem(todoItem, userId)

    // Delete Item from DB
    await todosRepository.deleteTodoItem(todoItem.todoId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(todoItem.todoId)
    }
}




import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'
import { TodosRepository } from '../../dataLayer/todos'
import { validateTodoItem } from '../../BusinessLayer/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('UpdateTodo event fired', {
        event: event,
    })

    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

    // TODO: Update the userId to be from jwt
    const userId = getUserId(event)
    let todosRepository = new TodosRepository()
    const result = await todosRepository.getTodoItem(todoId)
    const todoItem = result.Item as TodoItem

    // Validate todoItem 
    validateTodoItem(todoItem, userId)

    // Update todo in the DB
    await todosRepository.updateTodoItem(updatedTodo, todoId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(todoItem.todoId)
    }
}



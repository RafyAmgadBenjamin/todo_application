import 'source-map-support/register'
import { TodosRepository } from '../../dataLayer/todos'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoItem } from '../../models/TodoItem'
import { getUserId } from '../utils'
import { createSingleTodo } from '../../BusinessLayer/todos'
import { createLogger } from '../../utils/logger'



const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    logger.info('CreateTodo event fired', {
        event: event,
    })
    // TODO: Implement creating a new TODO item 

    // TODO: update it to be read from JWT

    const userId = getUserId(event)
    // Create the new Todo item
    let item: TodoItem;
    item = await createSingleTodo(userId, newTodo)
    // Store the new Todo
    let todosRepository = new TodosRepository()

    await todosRepository.addTodoItem(item)
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item
        })
    }
}



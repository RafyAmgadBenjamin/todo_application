import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { TodosRepository } from '../../dataLayer/todos'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { validateTodoItem, getTodoAttachmentUrl, getUploadUrl } from '../../BusinessLayer/todos'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: update the user id to be from jwt
    const userId = getUserId(event)

    logger.info('GenerateUploadUrl event fired', {
        event: event,
        todoId: todoId
    })

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = getUploadUrl(todoId)

    // TODO: make it work from repository
    let todosRepository = new TodosRepository()


    // Get the todo to update it
    const result = await todosRepository.getTodoItem(todoId)
    const todo = result.Item as TodoItem

    // Validate todoItem 
    validateTodoItem(todo, userId)

    // Create the attachment url
    const attachmentUrl = await getTodoAttachmentUrl(todoId)

    // Update the todo with url 
    await todosRepository.updateTodoAttachmentUrl(todoId, attachmentUrl)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            uploadUrl
        })
    }

}



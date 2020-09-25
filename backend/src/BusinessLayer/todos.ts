import { TodoItem } from '../models/TodoItem'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'

const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const bucketName = process.env.TODOS_S3_BUCKET
const logger = createLogger('auth')



export function validateTodoItem(todoItem: TodoItem, userId: string) {
    logger.info('validateTodoItem method fired', {
        todoItem: todoItem,
        userId: userId
    })

    // Todo item is not found
    if (!todoItem) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }

    // User is not allowed to update the todo
    if (todoItem.userId !== userId) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
}


export async function createSingleTodo(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {

    logger.info('createSingleTodo method fired', {
        createTodoRequest: createTodoRequest,
        userId: userId
    })

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

export async function getTodoAttachmentUrl(todoAttachmentId: string): Promise<string> {
    // Get the url that we use to update the todo item
    return `https://${bucketName}.s3.amazonaws.com/${todoAttachmentId}`
}

export function getUploadUrl(todoId: string) {
    logger.info('getUploadUrl method fired to get the upload url', {
        todoId: todoId
    })

    // Get a signed url 
    const s3 = new AWS.S3({ signatureVersion: 'v4' })
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

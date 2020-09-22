import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3 } from 'aws-sdk'
// import { TodosRepository } from '../../dataLayer/todos'
// import { UpgradeRequired } from 'http-errors'
// import * as uuid from 'uuid'
import * as AWS from 'aws-sdk'
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'




// import * as AWS from 'aws-sdk'
const logger = createLogger('auth')

const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const s3 = new S3({ signatureVersion: 'v4' })

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: update the user id to be from jwt
    const userId = "1"
    // const todoAttachmentId = uuid.v4()
    logger.info('generateUploadUrl method fired', {
        // Additional information stored with a log statement
        todoId: todoId
    })

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = getUploadUrl(todoId)
    logger.info('generateUploadUrl method getUploadUrl', {
        // Additional information stored with a log statement
        uploadUrl: uploadUrl
    })
    // TODO: make it work from repository
    // Get the todo to update it
    // let todosRepository = new TodosRepository()
    // let result = await todosRepository.getTodoItemFromDB(todoId)
    //    let todo = result.Item as TodoItem


    const result = await docClient.get({
        TableName: todosTable,
        Key: {
            todoId
        }
    }).promise()


    const todo = result.Item as TodoItem
    logger.info('generateUploadUrl method get todo', {
        // Additional information stored with a log statement
        todo: todo.todoId
    })
    // Todo item is not found
    if (!todo) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
    // User is not allowed to update the todo
    if (todo.userId !== userId) {
        return {
            statusCode: 403,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ''
        }
    }
    // Update the todo with url 
    logger.info('generateUploadUrl_method validate todo done')

    const attachmentUrl = await getTodoAttachmentUrl(todoId)

    logger.info('generateUploadUrl_method validate attachement_url to return to user',
        { attachmentUrl: attachmentUrl }
    )

    await updateTodoAttachementUrl(todoId, attachmentUrl)
    logger.info('generateUploadUrl_method update todo item', {
        todoId: todoId,
        attachmentUrl: attachmentUrl

    })
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

async function getTodoAttachmentUrl(todoAttachmentId: string): Promise<string> {
    // Get the url that we use to update the todo item
    return `https://${bucketName}.s3.amazonaws.com/${todoAttachmentId}`
}

function getUploadUrl(todoId: string) {
    // Get a signed url 
    logger.info('getUploadUrl method fired',
        {
            Bucket: bucketName,
            Key: todoId,
            Expires: urlExpiration
        }
    )
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

async function updateTodoAttachementUrl(todoId: string, attachmentUrl: string) {
    // update the todo item with the attachment url 
    await docClient.update({
        TableName: todosTable,
        Key: {
            todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
        }
    }).promise()
}
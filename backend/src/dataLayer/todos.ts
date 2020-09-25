
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'



const logger = createLogger('auth')
const AWSXRay = require('aws-xray-sdk-core');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const docClient = new AWS.DynamoDB.DocumentClient()

const todoUserIndex = process.env.TODOS_USER_INDEX
const todosTable = process.env.TODOS_TABLE


export class TodosRepository {

    async getTodoItem(todoId: String) {

        logger.info('getTodoItem method fired to get a todo', {
            todoId: todoId,
        })

        return await docClient.get({
            TableName: todosTable,
            Key: {
                todoId
            }
        }).promise()
    }

    async getTodosForUser(userId: String) {

        logger.info('getTodosForUser method fired to get all the user todos', {
            userId: userId,
        })

        return docClient.query({
            TableName: todosTable,
            IndexName: todoUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
    }

    async addTodoItem(todoItem: TodoItem) {
        logger.info('addTodoItem method fired to add a new todo', {
            todoItem: todoItem,
        })
        await docClient.put({
            TableName: todosTable,
            Item: todoItem
        }).promise()
    }

    async deleteTodoItem(todoId: String) {
        logger.info('deleteTodoItem method fired to delete a todo', {
            todoItem: todoId,
        })
        await docClient.delete({
            TableName: todosTable,
            Key: {
                todoId
            }
        }).promise()
    }

    async updateTodoItem(todoUpdated: TodoUpdate, todoId: String) {
        await docClient.update({
            TableName: todosTable,
            Key: {
                todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdated.name,
                ":dueDate": todoUpdated.dueDate,
                ":done": todoUpdated.done
            }

        }).promise()
    }
    async updateTodoAttachmentUrl(todoId: string, attachmentUrl: string) {
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

}


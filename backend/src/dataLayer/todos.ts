
import * as AWS from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'



const docClient = new AWS.DynamoDB.DocumentClient()
const todoUserIndex = process.env.TODOS_USER_INDEX
const todosTable = process.env.TODOS_TABLE


export class TodosRepository {

    async getTodoItem(todoId: String) {

        return await docClient.get({
            TableName: todosTable,
            Key: {
                todoId
            }
        }).promise()
    }

    async getTodosForUser(userId: String) {
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
        await docClient.put({
            TableName: todosTable,
            Item: todoItem
        }).promise()
    }

    async deleteTodoItem(todoId: String) {
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
    async updateTodoAttachementUrl(todoId: string, attachmentUrl: string) {
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


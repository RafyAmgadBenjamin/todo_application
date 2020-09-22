
import * as AWS from 'aws-sdk'
// import { TodoItem } from '../models/TodoItem'


const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE


export class TodosRepository {

    async getTodoItemFromDB(todoId: String) {

        return await docClient.get({
            TableName: todosTable,
            Key: {
                todoId
            }
        }).promise()
    }
}

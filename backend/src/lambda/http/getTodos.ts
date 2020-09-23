import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
// import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'
import { TodosRepository } from '../../dataLayer/todos'


// const docClient = new AWS.DynamoDB.DocumentClient()
// const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log("processing get todos", event)
  // const todoId = event.pathParameters.todoId
  // TODO: replace this constant with user id from jwt
  const userId = getUserId(event)
  let todosRepository = new TodosRepository()

  const result = await todosRepository.getTodosForUser(userId)

  let items = result.Items
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ items })
  }

}

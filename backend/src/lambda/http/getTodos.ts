import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { TodosRepository } from '../../dataLayer/todos'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info('GetTodo event fired', {
    event: event,
  })

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

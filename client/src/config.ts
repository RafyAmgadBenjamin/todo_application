// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ra7a0pirjh'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-8kyz9p1y.auth0.com',            // Auth0 domain
  clientId: '3lsrLf20zpRtukZu5MGkAS3Po9cmDxIw',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

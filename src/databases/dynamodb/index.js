const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const client = process.env.IS_OFFLINE
  ? DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: "localhost",
        endpoint: "http://0.0.0.0:8000",
        credentials: {
          accessKeyId: "MockAccessKeyId",
          secretAccessKey: "MockSecretAccessKey"
        }
      })
    )
  : DynamoDBDocumentClient.from(new DynamoDBClient({}));

module.exports = {
  dynamoDbClient: client
};

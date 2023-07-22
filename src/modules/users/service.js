const {
  PutCommand,
  ScanCommand,
  GetCommand
} = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("../../databases");
const bcrypt = require("bcryptjs");
const { default: ShortUniqueId } = require("short-unique-id");
const USER_TABLE = process.env.USER_TABLE;

const createUser = async (first_name, last_name, email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const uId = new ShortUniqueId({ length: 10 });
    const userId = uId();
    const params = {
      TableName: USER_TABLE,
      Item: {
        id: userId,
        first_name,
        last_name,
        email,
        password: hashedPassword
      }
    };
    await dynamodb.dynamoDbClient.send(new PutCommand(params));
    return {
      id: userId,
      first_name: first_name,
      last_name: last_name,
      email: email
    };
  } catch (error) {
    throw error;
  }
};

const findUserByEmail = async (email) => {
  const params = {
    TableName: USER_TABLE,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    }
  };

  try {
    const result = await dynamodb.dynamoDbClient.send(new ScanCommand(params));
    if (result.Items.length === 0) {
      return null;
    }
    return result.Items[0];
  } catch (error) {
    throw error;
  }
};
const findUserById = async (id) => {
  try {
    const params = {
      TableName: USER_TABLE,
      Key: {
        id: id
      }
    };

    const { Item: user } = await dynamodb.dynamoDbClient.send(
      new GetCommand(params)
    );
    if (user) {
      const { password, ...rest } = user;
      return rest;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};

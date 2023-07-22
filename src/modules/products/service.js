const { dynamodb } = require("../../databases");
const PRODUCT_TABLE = process.env.PRODUCT_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const { default: ShortUniqueId } = require("short-unique-id");
const {
  PutCommand,
  UpdateCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");
const { findUserById } = require("../users/service");
const AppError = require("../../utils/appError");

const createProduct = async (name, detail, user) => {
  try {
    const uId = new ShortUniqueId({ length: 10 });
    const productId = uId();
    const now = new Date();
    const params = {
      TableName: PRODUCT_TABLE,
      Item: {
        id: productId,
        name,
        detail,
        userId: user.id,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }
    };

    await dynamodb.dynamoDbClient.send(new PutCommand(params));

    const userData = await findUserById(user.id);

    return {
      id: productId,
      name,
      detail,
      user: userData,
      created_at: now.toLocaleDateString("en-GB"),
      updated_at: now.toLocaleDateString("en-GB")
    };
  } catch (error) {
    throw error;
  }
};

const getProduct = async (productId, user) => {
  try {
    const params = {
      TableName: PRODUCT_TABLE,
      Key: {
        id: productId
      }
    };

    const { Item: product } = await dynamodb.dynamoDbClient.send(
      new GetCommand(params)
    );

    if (product) {
      const userData = await findUserById(user.id);

      return {
        id: productId,
        name: product.name,
        detail: product.detail,
        user: userData
      };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

const getProducts = async (user) => {
  try {
    const params = {
      TableName: PRODUCT_TABLE,
      IndexName: "UserIdIndex",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": user.id
      }
    };

    const { Count, Items } = await dynamodb.dynamoDbClient.send(
      new QueryCommand(params)
    );
    const itemsChanged = Items.map((item) => {
      return {
        ...item,
        created_at: new Date(item.created_at).toLocaleDateString("en-GB"),
        updated_at: new Date(item.updated_at).toLocaleDateString("en-GB")
      };
    });
    return { Count, Items: itemsChanged };
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (productId, user, { name, detail }) => {
  const product = await getProduct(productId, user);
  if (!product) {
    throw new AppError("Product notfound", 404);
  }
  const now = new Date().toISOString();
  const params = {
    TableName: PRODUCT_TABLE,
    Key: {
      id: productId
    },
    UpdateExpression:
      "SET #name = :name, #detail = :detail,  #updated_at = :updated_at",
    ExpressionAttributeNames: {
      "#name": "name",
      "#detail": "detail",
      "#updated_at": "updated_at"
    },
    ExpressionAttributeValues: {
      ":name": name,
      ":detail": detail,
      ":updated_at": now
    }
  };

  try {
    await dynamodb.dynamoDbClient.send(new UpdateCommand(params));
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId, user) => {
  const product = await getProduct(productId, user);
  if (!product) {
    throw new AppError("Product notfound", 404);
  }

  const params = {
    TableName: PRODUCT_TABLE,
    Key: {
      id: productId
    }
  };

  try {
    await dynamodb.dynamoDbClient.send(new DeleteCommand(params));
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct
};

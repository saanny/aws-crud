const {dynamodb} = require("../../databases")
const PRODUCT_TABLE = process.env.PRODUCT_TABLE;
const USER_TABLE = process.env.USER_TABLE;
const { default: ShortUniqueId } = require("short-unique-id");
const { PutCommand, UpdateCommand, GetCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { findUserById } = require("../users/service");
const AppError = require("../../utils/appError");

const createProduct = async (name,detail,user)=>{
  try {
    const uId = new ShortUniqueId({ length: 10 });
    const productId = uId()
    const params = {
      TableName: PRODUCT_TABLE,
      Item: {
        id: productId,
        name,
        detail,
        userId:user.id
      },
    };

  await dynamodb.dynamoDbClient.send(new PutCommand(params));

   
  const userData = await findUserById(user.id)

    return {
      id: productId,
      name,
      detail,
      user:userData
    }
  } catch (error) {
    throw error;
  }
}

const getProduct = async (productId,user)=>{
  try {
    const params = {
      TableName: PRODUCT_TABLE,
      Key: {
        id: productId,
      },
    };
   
    const { Item:product } = await dynamodb.dynamoDbClient.send(new GetCommand(params))
     
    if(product){
      const userData = await findUserById(user.id)
    
      return {
        id: productId,
        name:product.name,
        detail:product.detail,
        user:userData
      }
    }else{

      return null
    }
    
  } catch (error) {
    throw error;
  }
}

const getProducts = async (user)=>{
  try {
    const params = {
      TableName: PRODUCT_TABLE,
      IndexName: 'UserIdIndex', 
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': user.id, 
      },
    };

    const {Count,Items} = await dynamodb.dynamoDbClient.send(new QueryCommand(params));
 
    return {Count,Items};
  } catch (error) {
    throw error;
  }
}

const updateProduct = async (productId,user,{name,detail})=>{

    const product = await getProduct(productId,user)
    if(!product){
      throw new AppError("Product notfound", 404);
    }

  const params = {
    TableName: PRODUCT_TABLE,
    Key: {
      id:  productId 
    },
    UpdateExpression: 'SET #name = :name, #detail = :detail', 
    ExpressionAttributeNames: {
      '#name': 'name', 
      '#detail': 'detail', 
     
    },
    ExpressionAttributeValues: {
      ':name':  name, 
      ':detail': detail , 
    
    },
  };

  try {
     await dynamodb.dynamoDbClient.send(new UpdateCommand(params));
    return true;

  } catch (error) {

    throw error;
  }
}

const deleteProduct = async(productId,user)=>{

  const product = await getProduct(productId,user)
  if(!product){
      throw new AppError("Product notfound", 404);
  }

  const params = {
    TableName: PRODUCT_TABLE, 
    Key: {
      id:  productId, 
    },
  };

  try {
    await dynamodb.dynamoDbClient.send(new DeleteCommand(params));
    return true;
  } catch (error) {
   
    throw error;
  }
}

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct
}
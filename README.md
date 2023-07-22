
# Serverless application with AWS  
simple serverless application with JWT authentication.


### Env
You can find envs in `serverless.yaml` in `environment` section.

`USER_TABLE` name of users table
`PRODUCT_TABLE` name of products table
`JWT_SECRET` secret key for jwt
`JWT_EXPIRES_IN` time of jwt expiration
### Local development

1. Install [docker](https://docs.docker.com/desktop/install/windows-install/#:~:text=Double%2Dclick%20Docker%20Desktop%20Installer,bottom%20of%20your%20web%20browser.) on your machine.

2. Install DynamoDB Local `sls dynamodb install` , This package has issue in installing please read this [github page](https://github.com/99x/serverless-dynamodb-local/issues/294)

3. run `sls dynamodb start --migrate`

4. run `sls offline start`

### Tests

1. run `sls offline start `

2. run `npm run tests` on another terminal.


### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-dynamodb-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-dynamodb-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-dynamodb-api-project-dev-api (766 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.


### Routes

## Register


```http
POST /api/v1/auth/register
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `first_name` | `string` | **Required**. |
| `last_name` | `string` | **Required**. |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 409 | `CONFLICT` |

## Login


```http
POST /api/v1/auth/login
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `email` | `string` | **Required**. |
| `password` | `string` | **Required**. |

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `OK` |
| 400 | `BAD REQUEST` |
| 401 | `Unauthorized | email or password wrong` |


## Create Product


```http
POST /api/v1/products
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | **Required**. provide in header authorization |
| `name` | `string` | **Required**. |
| `details` | `string` | **Required**. |

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 201 | `CREATED` |
| 400 | `BAD REQUEST` |
| 401 | `Unauthorized ` |

## Get Product


```http
GET /api/v1/products/:id
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | **Required**. provide in header authorization |
| `id` | `string` | **Required**. provide in query params|

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `0K` |
| 401 | `Unauthorized ` |


## Get Products


```http
GET /api/v1/products
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | **Required**. provide in header authorization |

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `0K` |
| 401 | `Unauthorized ` |



## Update Product


```http
PATCH /api/v1/products/:id
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | **Required**. provide in header authorization |
| `id` | `string` | **Required**. provide in query params|
| `name` | `string` | **Required**. provide in body|
| `details` | `string` | **Required**. provide in body|

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `0K` |
| 404 | `NOT FOUND` |
| 401 | `Unauthorized ` |




## Delete Product


```http
DELETE /api/v1/products/:id
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | **Required**. provide in header authorization |
| `id` | `string` | **Required**. provide in query params|

## Responses


```javascript
{
  "status" : number,
  "message" : string,
  "data"    : object | null
  "error"   : object | null
}
```
## Status Codes

| Status Code | Description |
| :--- | :--- |
| 200 | `0K` |
| 404 | `NOT FOUND` |
| 401 | `Unauthorized ` |

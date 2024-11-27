const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COMPRAS_TABLE = process.env.COMPRAS_TABLE;

exports.handler = async (event) => {
    try {
        const { user_id } = event.queryStringParameters; // Obtiene el user_id de los parámetros de consulta

        if (!user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'user_id es obligatorio' })
            };
        }

        // Obtener todas las compras de un usuario desde DynamoDB
        const result = await dynamodb.query({
            TableName: COMPRAS_TABLE,
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': user_id
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ compras: result.Items })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al obtener las compras', error: error.message })
        };
    }
};

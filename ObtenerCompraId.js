const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COMPRAS_TABLE = process.env.COMPRAS_TABLE;

exports.handler = async (event) => {
    try {
        const { id_compra, user_id } = event.pathParameters; // Obtenemos los parámetros de la ruta

        if (!id_compra || !user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_compra y user_id son obligatorios' })
            };
        }

        // Obtener la compra desde DynamoDB
        const result = await dynamodb.get({
            TableName: COMPRAS_TABLE,
            Key: { user_id, id_compra }
        }).promise();

        if (!result.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Compra no encontrada' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ compra: result.Item })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al obtener la compra', error: error.message })
        };
    }
};

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COMPRAS_TABLE = process.env.COMPRAS_TABLE;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { id_compra, user_id, cantidad_boletos, precio_total, estado } = body;

        // Validar que los datos esenciales estén presentes
        if (!id_compra || !user_id || !cantidad_boletos || !precio_total || !estado) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_compra, user_id, cantidad_boletos, precio_total y estado son obligatorios' })
            };
        }

        // Actualizar la compra
        await dynamodb.update({
            TableName: COMPRAS_TABLE,
            Key: { user_id, id_compra },
            UpdateExpression: 'SET cantidad_boletos = :cantidad, precio_total = :precio, estado = :estado',
            ExpressionAttributeValues: {
                ':cantidad': cantidad_boletos,
                ':precio': precio_total,
                ':estado': estado
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Compra modificada con éxito' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al modificar la compra', error: error.message })
        };
    }
};

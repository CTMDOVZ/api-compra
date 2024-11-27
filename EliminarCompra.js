const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const COMPRAS_TABLE = process.env.COMPRAS_TABLE;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { id_compra, user_id } = body;

        // Validar que los datos esenciales estén presentes
        if (!id_compra || !user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_compra y user_id son obligatorios' })
            };
        }

        // Eliminar la compra de DynamoDB
        await dynamodb.delete({
            TableName: COMPRAS_TABLE,
            Key: {
                user_id: user_id,  // Cambié 'id_usuario' a 'user_id'
                id_compra: id_compra
            }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Compra eliminada con éxito' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al eliminar la compra', error: error.message })
        };
    }
};

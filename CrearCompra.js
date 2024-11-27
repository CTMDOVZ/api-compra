const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { DateTime } = require('luxon');

const COMPRAS_TABLE = process.env.COMPRAS_TABLE;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        
        // Validar que los datos esenciales estén presentes
        if (!body.id_vuelo || !body.cantidad_boletos || !body.precio_total || !body.user_id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'id_vuelo, cantidad_boletos, precio_total y user_id son obligatorios' })
            };
        }

        // Crear el ítem de la compra
        const item = {
            user_id: body.user_id,  // Usar el user_id en lugar de id_usuario
            id_compra: body.id_compra,  // Usar el id_compra proporcionado
            id_vuelo: body.id_vuelo,
            fecha_compra: DateTime.now().toISO(),
            cantidad_boletos: body.cantidad_boletos,
            precio_total: body.precio_total,
            estado: 'pendiente'  // Estado inicial
        };

        // Guardar la compra en DynamoDB
        await dynamodb.put({
            TableName: COMPRAS_TABLE,
            Item: item
        }).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Compra creada con éxito', compra: item })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Ocurrió un error al crear la compra', error: error.message })
        };
    }
};

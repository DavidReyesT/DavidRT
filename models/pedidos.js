// Realizo las importaciones de las librerias utilizadas para:
var mongoose = require('mongoose');                    //Importar el manejador de MONGO DB

var Schema = mongoose.Schema; //Creo un objeto de tipo Schema para luego declarar el objeto de la base de datos

//Declaro el objeto para manejar las colecciones de la BD desde el servidor
var pedidoSchema = new Schema({
    fecha     : {type: Date, required: [true, 'La Fecha es Necesaria']},
    pedido    : {type: Number, required: [true, 'El NO° del pedido es necesario']},
    cliente   : {type: Schema.Types.ObjectId, ref: 'clientes', required: true},
    motivo    : {type: String},
    totales   : {type: Array, required: [true, 'Los montos son necesario']},
    posiciones: {type: Array, required: [true, 'Necesita almenos una posicion'] } },
    {collection: 'Pedidos'});

module.exports = mongoose.model('pedidos',pedidoSchema); //Exporto el Schema completo para utilizarlo en otro archivo
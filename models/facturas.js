var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var facturaSchema = new Schema({
    fecha     : {type: Date, required: [true, 'La Fecha es Necesaria']},
    factura   : {type: Number, required: [true, 'El NO° de factura es necesario']},
    cliente   : {type: Schema.Types.ObjectId, ref: 'clientes', required: true},
    motivo    : {type: String},
    totales   : {type: Array, required: [true, 'Los montos son necesario']},
    posiciones: {type: Array, required: [true, 'Necesita almenos una posicion'] } }, {collection: 'Facturas'}); 

    module.exports = mongoose.model('facturas', facturaSchema); 
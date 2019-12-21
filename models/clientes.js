var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//definir objeto
var clienteSchema = new Schema({
    nombre   : {type: String, required: [true, 'El nombre es Necesario']},
    nif      : {type: String, required: [true, 'El No. Identificación Fiscal es necesario']},
    pais     : {type: String, required: [true, 'El Pais es Necesario']},
    ciudad   : {type: String, required: false },
    direccion: {type: String, required: [true, 'La dirección Comercial es necesaria']},
    img      : {type: String, required:false},
    contacto : {type: Schema.Types.ObjectId, ref: 'Contactos' },
},{collection:'Clientes'});

module.exports = mongoose.model('clientes',clienteSchema);
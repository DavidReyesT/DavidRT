var mongoose = require('mongoose');   

var Schema = mongoose.Schema;

var contactoSchema = new Schema({
    nombre      : {type: String, required:[true, 'El nombre es Necesario']},
    img         : {type: String, required:false},
    departamento: {type: String, required:false},
    cargo       : {type: String, required:false},
    telefono    : {type: Number, required:false},
    empresa     : {type: Schema.Types.ObjectId, ref: 'clientes', required: [true, 'El Id del cliente es Necesario']},
    usuario     : {type: Schema.Types.ObjectId, ref: 'Usuarios', required: false}  }, 
    {collection: 'Contactos'});

module.exports = mongoose.model('contactos',contactoSchema);
//import { Mongoose, Schema } from "mongoose";
var mongoose = require('mongoose');
var validator = require('mongoose-unique-validator');

var rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE','GUEST_ROLE'],
    message:'{VALUE} no es un role permitido'
};

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre  : {type: String, required: [true, 'El nombre es Necesario']},
    email   : {type: String, unique:true, required: [true, 'El correo es Necesario']},
    password: {type: String, required: [true, 'El Password es Necesario']},
    img     : {type: String, required:false},
    role    : {type: String, required: true, default: 'USER_ROLE',enum: rolesValidos},
    google  : {type: Boolean, default: false} }, {collection: 'Usuarios'});

usuarioSchema.plugin(validator,{message:'{PATH} debe ser unico'});

module.exports = mongoose.model('usuarios',usuarioSchema);
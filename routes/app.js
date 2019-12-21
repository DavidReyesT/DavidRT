
var express = require('express');

var appRoute = express();
// Rutas

appRoute.get('/',(Request,Response,next) => {
    Response.status(200).json({
    Ok: true,
    mensaje: 'Peticion Realizada Correctamente'
    });
} );

module.exports = appRoute;


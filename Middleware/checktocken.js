// Realizo las importaciones de las librerias utilizadas para:
var jwt        = require('jsonwebtoken');          //Libreria utilizada para crear y utilizar el token
var seed       = require('../config/config').SEED; //Semilla o clave utilizada en la encriptacion y generacion del token
var messg   = require('../Messages/mssgservices'); //Libreria utilizada para la descripcion de los errores (Mssgservices.js)

//funcion para verificar y validar el TOKEN
exports.verificaToken = function (req,res,next) {
    
    var token = req.query.token;

    jwt.verify(token,seed,(err,decoded) => {
        if (err) {
            messg(res,401,err);

            // return res.status(401).json({
            //     Ok: false,
            //     mensaje: 'Error validando el token'
            //     });
        
        };
        req.usuario = decoded.usuario; // Se agraga el atributo usuario en el request para que este disponible despues de la
                                       // verificacion del token
        next();


    } );
}

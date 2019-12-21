//FUNCION utilizada en las respuestas de error de los CALLS BACKS DE LAS FUNCIONES CRUD
//CRUD: GET, PUT, POST, DELEATE. de los archivos .JS que se encuentran en la carpeta ROUTES.
function CRUDServices( res, mssgCode, arg ) {
var fnOk = false;
var fnMsg = '';
switch (mssgCode) {
    case 200:
        fnOk = true;
        fnMsg = "Accion Realizada Exitosamente"
        break;
    case 201:
        fnOk = true;
        fnMsg = "registro crado de manera Exitosa"
        break;
    case 202:
        fnOk = true;
        fnMsg = "Accion Aceptada"
        break;
        case 400:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 401:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 403:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 404:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 405:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 406:
        fnMsg = "Error de ejecución - error en la solicitud del servicio "
        break;
        case 500:
        fnMsg = "Error en la Base de Datos - Comuniquese con el Administrador"
        break;
        case 501:
        fnMsg = "Metodo o funcion no implementada - Comuniquese con el Administrador "
        break;
        case 502:
        fnMsg = "Error de gateway - Comuniquese con el Administrador "
        break;
        case 503:
        fnMsg = "Servicio No disponible - Intente en algunos minutos..!! "
        break;
        case 504:
        fnMsg = "Agotado el tiempo de espera en el GateWay"
        break;
        case 505:
        fnMsg = "HTTP - Version no Soportada"
        break;
    default:
        break;
};

return res.status(mssgCode).json({
    Ok: fnOk,
    mensaje: fnMsg,
    argmnt: arg });
};

module.exports = CRUDServices;
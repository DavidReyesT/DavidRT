
var express  = require('express');
var messages = require('../Messages/mssgservices');

var usrmodel = require('../models/usuario');
var clmodel = require('../models/clientes');
var contmodel = require('../models/contactos');

var routeSearch = express();

//================================
// Busqueda - Usuarios
//================================

routeSearch.get('/coleccion/:tabla/:busqueda',(req,res) =>{
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    
    var regExp = RegExp(busqueda,'i');

    var promesa;

    switch (tabla) {
        case 'Usuarios':
            promesa =  searchUsr(regExp);
        //               .then(data =>{
        //         messages( res,200,{ok: true,
        //                            usurios: data } );
        //     } )
        //                      .catch(err => { messages( res,400,{ok: false,
        //                         error: err }); } );
            break;
        case 'Contactos':
        promesa =  searchMed(regExp);
            break;
        case 'Clientes':
        promesa =  searchHsl(regExp);
            break;
        default:
            messages( res,404,{ok: false,
                               error: 'Ruta no valida' });return;
           break;
    };
    promesa.then(data =>{
                messages( res,200,{ok: true,
                                   datos: data } );return;;
            } )
            .catch(err => { messages( res,400,{ok: false,
                                               error: err });return; } );
}
);

//================================
// Busqueda General - Contactos
//================================

//================================
// Busqueda General - Clientes(Empresa)
//================================


//================================
// Busqueda General
//================================
routeSearch.get('/',(req,res) =>{
 
    var busqueda = req.query.busqueda;
    var regExp = new RegExp( busqueda,'i');

    Promise.all([searchUsr(regExp),searchClient(regExp),searchCont(regExp)])
           .then( respuestas => {
            messages( res,200,{ok: true,
                   Clientes: respuestas[1],
                   Contactos : respuestas[2],
                   Usuarios: respuestas[0]});return;
           } )
           .catch( errores => { 
            messages( res,400,{ok: false,
                               errorCli: errores[1],
                               errorCont: errores[2],
                               errorUsr: errores[0] });return;
           } );

} );

function searchUsr(regExp) {

    return new Promise((resolve,reject) => {
        usrmodel.find({},'nombre email role img')
               .or([{'nombre': regExp},{'email': regExp}])
               .exec((err,response) => {
            if (err){
                reject('Error en la busqueda de usaurios',err);
            } else {
                resolve(response);
            }
        } )
    }); 
}

function searchClient(regExp) {
    return new Promise((resolve,reject) => {
        clmodel.find({ nombre: regExp})
               .populate('clientes','nombre')
               .exec((err,response) =>{
               if(err){ reject('Error en la busqueda de la empresa',err);}
               else{    resolve(response); };
               })
    } );
    
}
function searchCont(regExp) {
    return new Promise((resolve,reject) => {
        contmodel.find({ nombre: regExp})
               .populate('contactos','nombre email')
               .populate('clientes','nombre')
               .exec((err,response) =>{
               if(err){ reject('Error en la busqueda de la empresa',err);}
               else{    resolve(response); };
               })
    } );
}

module.exports = routeSearch;
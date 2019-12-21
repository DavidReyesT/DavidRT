var express  = require("express");
var bcrypt   = require("bcryptjs");
var clmodel  = require("../models/clientes"); 

var chkToken = require("../Middleware/checktocken");
var messages = require("../Messages/mssgservices");

var appclientes = express();


// Servicios para realizar CRUD
// C: Create -> POST/
// R: Read   -> GET
// U: Update -> PUT/
// D: Delete -> DELETE

// =======================================================
//    Servicio GET - Lectura de datos OBtener un Hospital
// =======================================================

appclientes.get('/:id',(req,res) => {

var id = req.params.id;

appclientes.findById(id,(err,resp)=>{
    if(err){
        messages(res,500,err);return;
    };
    if(!resp){ messages(res,400,{'ok': false,
                                  cliente: null });return; }

    messages(res,200,{cliente:resp});return;
} ).populate('clientes','nombre img email');
} );

// =======================================
//    Servicio GET - Lectura de datos
// =======================================

appclientes.get('/',(req,res) => {

    var desde  = req.query.desde  || 0;
    desde  = Number( desde );
    var limite  = req.query.limite  || 10;
    limite  = Number( limite );
    
    clmodel.find({ },(err,datares)=> {
        if (err){
            messages(res,500,err);return;
        };

        clmodel.count({},(err,counter) => {messages(res,200,{ noRegistros:counter,
                                                             clientes: datares});return;});
    } ).populate('contacto','nombre email img')
       .skip(desde)
       .limit(limite)
       ;

} );


// ============================================
//  Servicio PUT - actualizacion de datos
//  ACtualiza los Hospitales en la Bdd
// ============================================

appclientes.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id     = req.params.id;
    var body   = req.body;

    clmodel.findById(id,(err,clientedb) => {
        if(err){
            messages(res,500,err);return;
        };
        if(!clientedb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };

        clientedb.nombre  = body.nombre;
        clientedb.usuario = req.usuario._id;

        clientedb.save((error, clienteactual) => {
            if(error){
                messages(res,400,{ message: `Error al actualizar el Cliente con el Id ${id}`,
                                   error  : error });return;
            };
            messages(res,201,{ message: 'Cliente Actualizado',
                               cliente: clienteactual});return;
        } );
    } ); 
} );
 
// ============================================
// Crea los Hospitales en la Bdd
// ============================================

appclientes.post('/',chkToken.verificaToken,(req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var cliente = new clmodel ({
        nombre:    body.nombre,
        nif:       body.nif,
        pais:      body.pais,
        ciudad:    body.ciudad,
        direccion: body.direccion,
        img:       body.img,
        contacto:  body.contacto,
    });

    cliente.save(( err, clientedb )=> {
        if (err){
            messages(res,400,err);return;
        };
        messages(res,200,{ message : 'cliente Creado',
                        body    : clientedb,
                        usrToken: req.usuario });return;
    } );
})

// ================================================
// elimina los Hospitales en la Bdd por medio del Id
// ================================================

appclientes.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    clmodel.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messages(res,500,err);return;
     };

     if ( !respBd ) {
        messages(res,403,{ message: `No existe el hospital con el Id ${id}` });return;
     };

     messages(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});return;
    } );
} );

function getById  (p_id) {
    clmodel.findById(id,(err, clientedb) => {
        if(err){
            messages(res,500,err);return;
        }
        if(!clientedb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };

        return clientedb;

} );
 };


module.exports = appclientes;


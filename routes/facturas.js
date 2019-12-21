var express  = require("express");
var bcrypt   = require("bcryptjs");
var facmodel  = require("../models/facturas"); 

var chkToken = require("../Middleware/checktocken");
var messages = require("../Messages/mssgservices");

var appfacturas = express();


// Servicios para realizar CRUD
// C: Create -> POST/
// R: Read   -> GET
// U: Update -> PUT/
// D: Delete -> DELETE

// =======================================================
//    Servicio GET - Lectura de datos OBtener un Hospital
// =======================================================

appfacturas.get('/:id',(req,res) => {

var id = req.params.id;

appfacturas.findById(id,(err,resp)=>{
    if(err){
        messages(res,500,err);return;
    };
    if(!resp){ messages(res,400,{'ok': false,
                                  factura: null });return; }

    messages(res,200,{factura:resp});return;
} ).populate('facturas','factura cliente totales');
} );

// =======================================
//    Servicio GET - Lectura de datos
// =======================================

appfacturas.get('/',(req,res) => {

    var desde  = req.query.desde  || 0;
    desde  = Number( desde );
    var limite  = req.query.limite  || 10;
    limite  = Number( limite );
    
    facmodel.find({ },(err,datares)=> {
        if (err){
            messages(res,500,err);return;
        };

        facmodel.count({},(err,counter) => {messages(res,200,{ noRegistros:counter,
                                                             facturas: datares});return;});
    } ).populate('facturas','factura cliente totales')
       .skip(desde)
       .limit(limite)
       ;

} );


// ============================================
//  Servicio PUT - actualizacion de datos
//  ACtualiza los Hospitales en la Bdd
// ============================================

appfacturas.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id     = req.params.id;
    var body   = req.body;

    facmodel.findById(id,(err,facdb) => {
        if(err){
            messages(res,500,err);return;
        };
        if(!factdb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };

        facdb.motivo  = body.motivo;
        facdb.cliente = req.cliente._id;

        facdb.save((error, factual) => {
            if(error){
                messages(res,400,{ message: `Error al actualizar la factura con el Id ${id}`,
                                   error  : error });return;
            };
            messages(res,201,{ message: 'factura Actualizada',
                               factura: factual});return;
        } );
    } ); 
} );
 
// ============================================
// Crea los facturas en la Bdd
// ============================================

appfacturas.post('/',chkToken.verificaToken,(req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var factura = new facmodel ({
        fecha     : body.fecha,
        factura   : body.factura,
        cliente   : body.cliente,
        motivo    : body.motivo,
        totales   : body.totales,
        posiciones: body.posiciones})

    factura.save(( err, facturadb )=> {
        if (err){
            messages(res,400,err);return;
        };
        messages(res,200,{ message : 'factura Creada',
                        body    : facturadb,
                        usrToken: req.usuario });return;
    } );
})

// ================================================
// elimina las facturas en la Bdd por medio del Id
// ================================================

appfacturas.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    facmodel.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messages(res,500,err);return;
     };

     if ( !respBd ) {
        messages(res,403,{ message: `No existe la factura con el Id ${id}` });return;
     };

     messages(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});return;
    } );
} );

function getById  (p_id) {
    facmodel.findById(id,(err, facdb) => {
        if(err){
            messages(res,500,err);return;
        }
        if(!facdb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };

        return facdb;

} );
 };

module.exports = appfacturas;
// Realizo las importaciones de las librerias utilizadas para:
var express  = require("express");                       // Manejador EXPRESS
var bcrypt   = require("bcryptjs");                      // Libreria utilizada para encriptar datos (la utilizo al encriptar la clave de los usuarios)
var pedmodel  = require("../models/pedidos");            // Importando el Schema del modelo de PEDIDOS (coleccion)

var chkToken = require("../Middleware/checktocken");     // Libreria para validar el TOKEN
var messages = require("../Messages/mssgservices");      // Libreria para determinar el error y ejecutaar un mensaje (de error)

var funcioncompra = require("./compra/funcioncompra");   //

var appfacturas = express();                             // Creado para manejar las funciones del servidor express

// Servicios para realizar CRUD
// C: Create -> POST/
// R: Read   -> GET
// U: Update -> PUT/
// D: Delete -> DELETE

// =======================================================
//    Servicio GET - Lectura de datos OBtener un pedido
// =======================================================

//Funcion para obtener un pedido en base al ID (el ID es recibido como un parametro dentro de la direccio URL)
appfacturas.get('/:id',(req,res) => {

var id = req.params.id;

//funcion para BUSCAR POR ID
appfacturas.findById(id,(err,resp)=>{
    if(err){
        messages(res,500,err);return;            
    };
    if(!resp){ messages(res,400,{'ok': false,
                                  factura: null });return; }

    messages(res,200,{factura:resp});return;
} ).populate('facturas','factura cliente totales'); //Indica que campos se requieren traer de una coleccion de la BD
} );

// =======================================
//    Servicio GET - Lectura de datos
// =======================================

//funcion para LEER todos registro (pedido en este caso) de la BD
appfacturas.get('/',(req,res) => {

    var desde  = req.query.desde  || 0;
    desde  = Number( desde );
    var limite  = req.query.limite  || 10;
    limite  = Number( limite );
    
    pedmodel.find({ },(err,datares)=> {
        if (err){
            messages(res,500,err);return;
        };

        facmodel.count({},(err,counter) => {messages(res,200,{ noRegistros:counter,
                                                             facturas: datares});return;});
    } ).populate('facturas','factura cliente totales')
       .skip(desde)   // desde donde debe leer los registros
       .limit(limite) // hasta donde debe leer los registros
       ;
} );

// ============================================
//  Servicio PUT - actualizacion de datos
//  ACtualiza los Pedidos en la Bdd
// ============================================

//funcion para actualizar los registros de la BD, donde para poder realizarlo se debe validar un TOKEN (por "seguridad")
appfacturas.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id     = req.params.id;
    var body   = req.body;

    pedmodel.findById(id,(err,peddb) => {
        if(err){
            messages(res,500,err);return;
        };
        if(!peddb){
            messages(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };

        peddb.motivo  = body.motivo;
        peddb.cliente = req.cliente._id;

        //funcion propia del manejador de la BD la cual almacena y guarda los datos actualizados en su respectiva coleccion
        peddb.save((error, pactual) => {
            if(error){
                messages(res,400,{ message: `Error al actualizar el pedido con el Id ${id}`,
                                   error  : error });return;
            };
            messages(res,201,{ message: 'factura Actualizada',
                               pedido: pactual});return;
        } );
    } ); 
} );
 
// ============================================
// Crea los pedidos en la Bdd
// ============================================

appfacturas.post('/', (req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js
    var posiciones = body.posiciones;
    console.log(posiciones);
    let objposicion = funcioncompra.noItems(posiciones);//parseo en el noItems


    var pedido = new pedmodel({
        fecha      : body.fecha,
        pedido     : body.pedido,
        cliente    : body.cliente,
        motivo     : body.motivo,
        totales    : body.totales,
        posiciones : objposicion.items
    })

    pedido.save(( err, pedidodb )=> {
        if (err){
            messages(res,400,err);return;
        };
        messages(res,200,{ message : 'pedido Creado',
                        body    : pedidodb,
                         });return;
    } );
})

// ================================================
// elimina las pedido en la Bdd por medio del Id
// ================================================

appfacturas.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    pedmodel.findByIdAndRemove(id,(err,respBd) =>{
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
    pedmodel.findById(id,(err, facdb) => {
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
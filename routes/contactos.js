var express    = require('express');
var bcrypt     = require('bcryptjs');

var chkToken   = require('../Middleware/checktocken'); 
var messg      = require('../Messages/mssgservices');

var appcontactos  = express();
var appclientes = require('../routes/clientes')
var clmodels  = require('../models/clientes');
var contmodels  = require('../models/contactos');
 
var salt = bcrypt.genSaltSync(10);
// Rutas

// =======================================================
//    Servicio GET - Lectura de datos Obtener un contacto
// =======================================================

appcontactos.get('/:id',(req,res) => {

var id = req.params.id;

contmodels.findById(id,(err,resp)=>{
    if(err){
        messg(res,500,err);return;
    };
    if(!resp){ messg(res,400,{'ok': false,
                                  contacto: null });return; }

    messg(res,200,{contacto:resp});return;
} ).populate('usuario','nombre email img')
   .populate('empresa');
} );



// ============================================
// Obtiene todos los contactis Creados de la Bdd
// ============================================
// appMedicos.get('/',chkToken.verificaToken,(Request,Response) => {
 appcontactos.get('/', (Request,Response) => {

    var desde  = Request.query.desde  || 0;
    desde  = Number( desde );
    var limite  = Request.query.limite  || 1;
    limite  = Number( limite );

    contmodels.find({ },'nombre empresa img' )
              .populate('usuario','nombre email')
              .populate('empresa', 'nombre')
              .skip(desde)
              .limit(limite)
              .exec( (err,data) => {
                if (err) {
                    messg(Response,500,err);return;
                };
                contmodels.count({ },(err,counter) => {messg(Response,200,{ noRegistros: counter,
                                                                            contactos: data});return; });
            }
            )
        } );

// ============================================
// Validar Token
// Se crea una funcion que recibe como parametros el Request, Response y el Next
// Posteriormente se coloca como segundo parametro en los llamados
// ============================================

// ============================================
// Actualiza datos de un contacto en la Bdd
// ============================================

appcontactos.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id   = req.params.id;
    var body = req.body;
    
    contmodels.findById(id,(err,contactodb) => {
        if(err){
               messg(res,500,err);return;
        }

        if(!contactodb){
            messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        }

        contactodb.nombre   = body.nombre;
        
        clmodels.findById(body.empresa,(err,clientedb) => {
            if(err){
                   messg(res,500,err);return;
            }
            if(!clientedb){
                messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
            };
        } );
        contactodb.empresa   = body.empresa;

        contactodb.save((error,contactoactual) => {
            if(error){
                messg(res,400,{ message: `Error al actualizar el contacto con el Id ${id}`,
                                error  : error });return;
            }
            messg(res,201,{ message: 'contacto Actualizado',
                            usr: contactoactual});return;
        } );
    } ); return;
} );

// ============================================
// Crea los contactos en la Bdd
// ============================================

appcontactos.post('/',chkToken.verificaToken,(req, res) => {

    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var contacto = new contmodels ({
        nombre:   body.nombre,
        img:      body.img, 
        usuario:  req.usuario._id
    });

    clmodels.findById(body.empresa,(err,empresadb) => {
        if(err){
               messg(res,500,err);return;
        }
        if(!empresadb){
            messg(res,404,{ message: `Error en el ingreso del Id ${id}` });return;
        };
    } );
    contacto.empresa   = body.empresa;

    contacto.save(( err, contacto )=> {
        if (err){
            messg(res,400,err);return;
        };
        messg(res,200,{ message : 'usuario Creado',
                        contacto : contacto,
                        usrToken: req.usuario });return;
    } );
})

// ================================================
// elimina un Contacto en la Bdd por medio del Id
// ================================================

appcontactos.delete('/:id',chkToken.verificaToken,(req, res) => {
    var id = req.params.id;
    contmodels.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messg(res,500,err);return;
     };

     if ( !respBd ) {
        messg(res,403,{ message: `No existe el usuario con el Id ${id}` });return;
     };

     messg(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});
                     return;
    } );
} );
module.exports = appcontactos;

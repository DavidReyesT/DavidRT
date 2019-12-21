var express    = require('express');
var bcrypt     = require('bcryptjs');

var chkToken   = require('../Middleware/checktocken');
var messg      = require('../Messages/mssgservices');

var appRoute   = express();
var appUsuario = require('../models/usuario');

var salt = bcrypt.genSaltSync(10);
// Rutas

// ============================================
// Obtiene todos los usuarios de la Bdd
// ============================================
//  appRoute.get('/',chkToken.verificaToken,(Request,Response) => {
 appRoute.get('/',(Request,Response) => {
//    appRoute.get('/',(Request,Response) => {   
     var desde  = Request.query.desde  || 0;
     desde  = Number( desde );
     var limite  = Request.query.limite  || 10;
     limite  = Number( limite );

    appUsuario.find({ },'nombre email role img google' )
            .skip(desde)
            .limit(limite)
            .exec( (err,data) => {
                if (err) {

                    messg(Response,500,err);
                    // return Response.status(500).json({
                    //     Ok: false,
                    //     mensaje: 'Error cargando usuarios'
                    //     });
                    return;
                };
                appUsuario.count({},(err,counter)=> {
                    messg(Response,200,{ totalReg: counter,
                                         usuarios: data, usrToken: Request.usuario });
                    return;

                } );
                
            }
            );
        } );

// ============================================
// Validar Token
// Se crea una funcion que recibe como parametros el Request, Response y el Next
// Posteriormente se coloca como segundo parametro en los llamados
// ============================================

// ============================================
// ACtualiza los usuarios en la Bdd
// ============================================

appRoute.put('/:id', chkToken.verificaToken ,(req,res) => {

    var id   = req.params.id;
    var body = req.body;

    appUsuario.findById(id,(err,usuarioMdb) => {
        if(err){
               messg(res,500,err);
               return;
        };

        if(!usuarioMdb){
            messg(res,404,{ message: `Error en el ingreso del Id ${id}` });
            return;
        };

        usuarioMdb.nombre = body.nombre;
        usuarioMdb.role = body.role;
        usuarioMdb.email = body.email;

        usuarioMdb.save((error,usuarioUpdate) => {
            if(error){
                messg(res,400,{ message: `Error al actualizar el usaurio con el Id ${id}`,
                                error  : error });
                                return;
            }
            messg(res,201,{ message: 'usuario Actualizado',
                            usr: usuarioUpdate});
                            return;
            // res.status(200).json({
            //     Ok: true,
            //     mensaje: 'Usuario Actualizado',
            //     data: usuarioUpdate
            // });
        } );
    } );
} );

// ============================================
// Crea los usuarios en la Bdd
// ============================================

// appRoute.post('/',chkToken.verificaToken,(req, res) => {
appRoute.post('/',(req, res) => {
    var body = req.body;  // Solamente funciona al configurar el body parser en el app.js

    var usuario = new appUsuario ({
        nombre:   body.nombre,
        email:    body.email,
        password: bcrypt.hashSync(body.password, salt),
        img:      body.img,
        role:     body.role
    });

    usuario.save(( err, userMDB )=> {
        if (err){
            messg(res,400,err)
            return;
        };
        messg(res,200,{ message : 'usuario Creado',
                        body    : userMDB,
                        usrToken: req.usuario });
        return;
    } );
})

// ================================================
// elimina los usuarios en la Bdd por medio del Id
// ================================================

appRoute.delete('/:id',chkToken.verificaToken,(req, res, next) => {
    var id = req.params.id;
    appUsuario.findByIdAndRemove(id,(err,respBd) =>{
     if (err) {
        messg(res,500,err);
        return;
     };

     if ( !respBd ) {
        messg(res,403,{ message: `No existe el usuario con el Id ${id}` });
        return;
     };

     messg(res,200,{ message: 'Registro eliminado correctamente',
                     resp: respBd});
                     return;
    } );
} );


module.exports = appRoute;


var express    = require('express');
var fileUpload = require('express-fileupload');
var modelUsr   = require('../models/usuario');
var modelcont  = require('../models/contactos');
var modelclient= require('../models/clientes');
var mssges     = require('../Messages/mssgservices')
var fs         = require('fs');

var upload     = express();
var arraycol   = ['usuarios','contactos','clientes'];
var arrayext   = ['jpg','imp','jpeg','gif','tif','png','JPG','IMP','JPG','GIF','TIF','PNG'];
var arrayName  = [];
var extension;
var fileName;
var coleccion;
var id;
var newname;


upload.use(fileUpload());

upload.put('/:coleccion/:id',(req,res,next) => {

coleccion = req.params.coleccion;
id        = req.params.id;

    if(!req.files){
        mssges(res,400,{Error: 'No existe ningun Archivo'});return;
    }

    if (arraycol.indexOf(coleccion) < 0 ){
        mssges(res,403,{ Ok: false,
                         Error: `Extensión ${coleccion} no permitida`});return;
    };

fileName  = req.files.archivo;
arrayName = fileName.name.split('.');

if (fileName){
    extension = arrayName[arrayName.length - 1];
    if (arrayext.indexOf(extension) < 0){
        mssges(res,403,{ Ok: false,
                         Error: `Extensión ${extension} no permitida`});return;
    };

// Nombre Personalizado
    newname = `${id}-${new Date().getMilliseconds()}.${extension}`;
    path    = `./uploads/${coleccion}/${newname}`;
    fileName.mv(path,(error) => {
      if (error){
       mssges(res,400,{ 'Ok': false,
                         'path':path,
                         'mensaje': 'Nombre personalizado',
                         'error': error });
                        }else{
        imgColection(res,coleccion,id,newname); return;                  
                        }
    } );  
 }
} );

function imgColection(res,coleccion,id,filename)
{
  switch (coleccion) {
      case 'Usuarios':
          modelUsr.findById(id,(err,user) => {
          if(err){mssges(res,400,{Error: err});return};
          if(delOldImg(res,user.img,coleccion)){
            user.img= filename; };  
            user.save((err,userAct) => {
             if (err){mssges(res,400,{Error: err});return;};
             mssges(res,200,{'usuarioAct': userAct});return;
            } );
        });
          break;
      case 'Clientes':
          modelclient.findById(id,(err,client)=>{
            if(err){mssges(res,400,{Error: err});return;};
            if(delOldImg(res,client.img,coleccion)){
                client.img= filename; 
                client.save((err,clienteAct) => {
                    if (err){mssges(res,400,{Error: err});return;};
                    mssges(res,200,{'usuarioAct': clienteAct});return;
                   } );
            };  });
          break;
      case 'Contactos':
          modelcont.findById(id,(err,contacto)=>{
            if(err){mssges(res,400,{Error: err});return;};
            if(delOldImg(res,contacto.img,coleccion)){
                contacto.img= filename; 
               contacto.save((err,contAct) => {
                    if (err){mssges(res,400,{Error: err});return;};
                    mssges(res,200,{'usuarioAct': contAct});return;
                   } );}; });
          break;
      default:
           mssges(res,500,{Error:'Coleccion no valida'});return;
          break;
  }

};

function delOldImg(res,img,coleccion) {
    if (img === null || img === undefined || img === '' ) {
        return true;
    }
    var oldPath = `./uploads/${coleccion}/${img}`;
   if(fs.existsSync(oldPath)){
       fs.unlink(oldPath,(error)=>{ 
        if(error){
            mssges(res,500,{'mensaje': 'Error en eliminacion del archivo',
                            'error'  : error}); return false;
        }
       });
   }
//    else{
//     // mssges(res,400,{'mensaje': 'Error en la ruta del acceso',
//     //                 'path'   : oldPath}); 
//                     return;
//    };
   return true;
};

module.exports = upload; 
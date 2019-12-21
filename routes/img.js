var express = require('express');
var fs      = require('fs');   // No necesita ser importado con npm, es propio del core 
const path  = require('path'); // No necesita ser importado con npm, es propio del core
var appImg = express();


appImg.get('/:coleccion/:img',(Request,Response,next) => {

    var coleccion = Request.params.coleccion;
    var imagen    = Request.params.img;

    var pathImg = path.resolve(__dirname,`../uploads/${coleccion}/${imagen}`);

    if(!fs.existsSync(pathImg)){
        pathImg = path.resolve(__dirname,'../assets/no-img.jpg');
    };

    Response.sendFile(pathImg);
    
} );

module.exports = appImg;
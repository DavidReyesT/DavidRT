//*************** -ARCHIVO PRINCIPAL PARA LA EJECICION DE LA APLICACION- *****************

// Requires -> importaciones en NodeJs
var mongoose = require("mongoose");      //Libreria del manejador de la base de datos MONGO DB
var express  = require("express");       //Libreria del manejador EXPRESS
var bodyParser = require('body-parser'); //Libreria de PARSER


// Para utilizar las rutas es necesario importarla
var appRoutes      = require("./routes/app");
var appUsuarios    = require("./routes/usuario");
var routeLogin     = require("./routes/login")
var routeClientes  = require("./routes/clientes");
var routeContactos = require("./routes/contactos");
var routeBusqueda  = require("./routes/busqueda");
var routeUpload    = require('./routes/fileupload');
var routeImg       = require('./routes/img');
var routefacturas  = require('./routes/facturas');
var routepedidos   = require('./routes/pedidos');

// Inicializacion de variable
var app = express();

// CORS -> Control de acceso de llamadas HTTP ( Cross Origin Resource Sharing )

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); //Desde donde se puede usar
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//Tipo de fuente u origen de mensaje
        res.header("Access-Control-Allow-Methods", "POST, PUT, GET,DELETE, OPTIONS"); //metodos http a utilizar
        next();
      });

// Conexion a Mongo DB deprecated;

// mongoose.Connection.openUri('mongodb://localhost:2701/FacturaDB', 
//                            (err,Response) => { if (err) throw err;
//                             console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
//                         });


// mongoose.connect('mongodb://localhost:27017/FacturaDB',{useMongoClient: true } )
mongoose.connect('mongodb://localhost:27017/FacturasDB')
        .then( () => { console.log('conexion realizada con exito \x1b[32m%s\x1b[0m','FacturaDB')})
        .catch((err) => { console.log('error de conexion',err)});

// **** Otra manera de conectarse *****

// mongoose.connect('mongodb://localhost:27017');

// var db = mongoose.connection;
// db.openUri()
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//  // we're connected!
// });

// middlewhare xxx.use<>

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/busqueda',routeBusqueda);
app.use('/clientes',routeClientes);
app.use('/contactos',routeContactos);
app.use('/usuario',appUsuarios);
app.use('/login',routeLogin);
app.use('/upload',routeUpload);
app.use('/img', routeImg);
app.use('/',appRoutes);
app.use('/facturas',routefacturas);
app.use('/pedidos',routepedidos);

// Escuchar peticiones (RUTAS POR LA CUAL LLEGARA INFO), en este caso el puerto 3000
app.listen(3000, () => { console.log('Express Server puerto 3000:\x1b[32m%s\x1b[0m', 'online'); } );
//\x1b[32m%s\x1b[0m' => codigo para cambiar el color al escribir por pantalla.
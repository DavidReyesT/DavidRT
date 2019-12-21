//Creo y declaro un objeto el cual representa las posiciones del pedido (ITEMS)
var pedido = new Object({
    'posicion' : Number,
    'material' : String,
    'descripcion' : String,
    'cantidad' : Number,
    'umedida' : Number,
    'precio'  : Number,
    'total'   : Number
})

//funcion para realizar el Parseo (traduccion de la estructura JSON a un OBJETO)
function poItems(items){
    var pitems = new Array;
    var tValue;

    pitems = JSON.parse(items, (key, value) => {console.log('key:', key, 'Value:', value)});

    return {pitems}
}

//funcion de prueba para la toma de valores
function totalValue (items){
    var ordrItem = new Array;
    var tValue = Number;
    console.log('Prueba Items', items);
    ordrItem = items;

    ordrItem.forEach(element => {tValue += element.total; });
    return tValue;
}
//funcion utilizada en el archivo .JS para retornar las posiciones del pedido
function noItems (items){
    var ordrItem = new Array;
    var tValue   = 0;
    var tQtty    = 0;
    var citem;

    
    ordrItem = JSON.parse(items, (key, value) => {
        switch (key){
            case 'cantidad':
                tQtty = tQtty + value;
                break 
            case 'total':
                tValue = tValue + value;
                break 
            default:
                break;
        }
    });

    ordrItem = JSON.parse(items);
   // console.log(items);
   // console.log(ordrItem);
    citem = ordrItem.length;
    // PARA COMPROBAR POR CONSOLA: console.log('Cantidad',tQtty,'valor',tValue,'Registros',citem);

    return{
        'items' : ordrItem,
        'tValue': tValue,
        'tQtty' : tQtty,
        'nItems': citem
    }
}
module.exports = {totalValue, noItems, pedido}
require('dotenv').config();
const WebSocket = require("ws");
const ws = new WebSocket(`${process.env.STREAM_URL}btcusdt@markPrice@1s`) //par que queiro monitorear, que quiero(market price), lapso
const wsCandles = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_1m`) //stream candles
const api = require("./api");
const instrumentos= require("./instrumentos")
let posicionAbierta= false;
/* ws.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    //console. clear();
    
    const datos = JSON.parse(event.data);
    //console.log(event.data); //todos los datos
    console.log(`Symbol: ${datos.s}`)
    console.log(`precio: ${datos.p}`)

    //------------ejemplo -------------------------------
    
    const precio = parseFloat(datos.p);
    if(precio<16810 && !posicionAbierta){
        console.log("abrir posicion")
        posicionAbierta=true;
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
            })
        
    }
    else if(precio > 18000 && posicionAbierta){
        console.log("cerrar posicion")
        posicionAbierta=false;
        api.abrirPosicion("BTCUSDT", "0.001","SELL")
            .then(data => {
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=true;
            })
        
    }
    else{
        console.log("esperando")
    }

} */


//-------------------stream candles -----------------------------
/* wsCandles.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    //console. clear();
    
    
    //console.log(event.data); //todos los datos
    console.log(event.data)
    
} */




//-------------mostrar hitorico por consola-----------
/* async function nppp(){
    datos = await api.recuperarHistoricoVelas("btcusdt", "1m");
    console.log(datos)
}

nppp(); */

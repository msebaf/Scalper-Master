ws.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
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

} 

var i=0;
//-------------------stream candles -----------------------------
wsCandles.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    //console. clear();
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
       console.log("Esta vela esta cerrada chuki chuku chu")
       i=0;
    }
    //console.log(event.data); //todos los datos
    i++
    
    console.log(i)
    
}




//-------------mostrar hitorico por consola-----------
//------------- usar para iniciar estrategia---------
async function algo(){
    let candeles =  await api.recuperarHistoricoVelas("btcusdt", "3m");
    //candeles=JSON.parse(candeles);
    console.log(candeles);
    }
    
    algo();
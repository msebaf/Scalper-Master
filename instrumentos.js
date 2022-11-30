

//RSI> se saca sobre 14 cierres de mercado (necesarios 15 para calcular)
// si < 30 sobrevendido ---- si >70 sobrecomprado ------ = 50 mercado lateralizado
// precios desde mas viejo a mas nuevo...cotejar como vienen de la api
function calculadoraRSI(arrayListaDeprecios, datosStream){
    if(datosStream){
        arrayListaDeprecios.push(datosStream);
        if(arrayListaDeprecios>15){
            arrayListaDeprecios.shift();
        }
    }
    
    let sumaCierresPositivos=0;
    let sumaCierresNegativos=0;
    let cantidadPositivos=0;
    let cantidadNegativos=0;
    let avgU=0;
    let avgD=0;
    let periodo =  arrayListaDeprecios.length-1;
    let relativeStrenght = 0;

    for (let i = 1; i < arrayListaDeprecios.length; i++) {
        if(arrayListaDeprecios[i]>arrayListaDeprecios[i-1]){
            sumaCierresPositivos+=(arrayListaDeprecios[i]-arrayListaDeprecios[i-1]);
            cantidadPositivos++
        }
        else{
            sumaCierresNegativos+= (arrayListaDeprecios[i-1]-arrayListaDeprecios[i]);
            cantidadNegativos++;
        }
        
    }
    //console.log(sumaCierresNegativos)
    //console.log(sumaCierresPositivos)
    avgU= sumaCierresPositivos/periodo;
    //console.log("avgU " + avgU)
    avgD= sumaCierresNegativos/periodo;
    //console.log("avgD " + avgD)
    try{
    relativeStrenght= avgU/avgD;
    //console.log("RS "+ relativeStrenght)
    RelativeSI= 100-(100/(1+relativeStrenght));
    }
    catch{
        RelativeSI=100;
    }
    
    return RelativeSI;

}

async function mediaMovil(arrayDePrecios){
    let precios = await arrayDePrecios;
    let sumatoria=0;
    let mediaMovil=0;
    for (let i = 0; i < precios.length; i++) {
        sumatoria += precios[i];
    }
    mediaMovil= sumatoria/precios.length;
    return mediaMovil;

}  

function mediaMovilPonderada(arrayDePrecios){
    //mayot prioridad a precios mas recientes
    let precios = arrayDePrecios;
    let factorPonderacion =0;
    for (let k = 0; k < precios.length; k++) {
       factorPonderacion +=k+1;
        
    }
    
    let mediaPonderada=0
    for (let i = 0; i < precios.length; i++) {
        mediaPonderada += (precios[i] * ((i+1)/factorPonderacion))
    }
    return  mediaPonderada;


}

async function desviacionEstandar(ArrayEsto){
    let media= await mediaMovil(ArrayEsto)
    console.log(media)
    let diferencias = 0;
    for (let i = 0; i < ArrayEsto.length; i++) {
        
        diferencias+= Math.pow((ArrayEsto[i] -  media),2)
    }
    
    let desviacion = Math.sqrt(diferencias/(ArrayEsto.length-1))
    console.log(desviacion)
    return desviacion;
}

//Para volatilidad y tendencias, margen amplio mayor volatilidad, mayores precios sobre la media o rompe linea superior 
// probable cambio de tnedencia
//20 periodos
async function bandasDeBolinger(arrayParaBolinger, datoStream){
    if(datoStream){
    arrayParaBolinger.push(datoStream);
    if(arrayParaBolinger.length<20){
        arrayParaBolinger.shift();
    }}
    let bandaMedia= mediaMovil(arrayParaBolinger);
    let desviacionEstandar= desviacionEstandar(arrayParaBolinger);
    let bandaSuperior = bandaMedia+(2*desviacionEstandar);
    let bandaInferior = bandaMedia-(2*desviacionEstandar);
    let bandasBolinger= [bandaSuperior,bandaMedia, bandaInferior]
    return bandasBolinger;
    
}


// k > 80% sobrecomprada------ k<20% sobrevendido
// implementar luego estocastico lento para => la linea k debe cruzar D , abajo arriba comprar, arriba hacia abajo vender (implementar luego estocastico lento)
async function estocasticoRapido(ArrayEsto, valorStream){
    if(valorStream){
    ArrayEsto.push(valorStream);
    if(ArrayEsto.length>14){
        ArrayEsto.shift()
    }}
  

    let valorMax= ArrayEsto[0];
    let valorMin= ArrayEsto[0];
    
    for (let i = 0; i < ArrayEsto.length; i++) {
        if(ArrayEsto[i]>valorMax){
            valorMax=ArrayEsto[i];
        }
        if(ArrayEsto[i]<valorMin){
            valorMin=ArrayEsto[i];
        }
        
    }
    let cierre= ArrayEsto[ArrayEsto.length-1];
    let K = 100*((cierre - valorMin)/(valorMax-valorMin))
    console.log(K);
    return K;
}

async function estocasticoLento(ArrayDeEstoRapidos, nuevoEstoRapido){
    if(nuevoEstoRapido){
   await ArrayDeEstoRapidos.push(nuevoEstoRapido);
    if(ArrayDeEstoRapidos>5){
        ArrayDeEstoRapidos.shift();
    }}
    return mediaMovil(ArrayDeEstoRapidos)
}

async function MACD(arrayCorto,canDatosCorto, arrayLargo, cantDatosLargo, datoDeStream){
        if(datoDeStream){
       await arrayCorto.push(datoDeStream);
        if(arrayCorto.length>canDatosCorto){
        arrayCorto.shift();
       
    }

   await arrayLargo.push(datoDeStream);
    if(arrayLargo.length>cantDatosLargo){
        arrayLargo.shift();
        
    }}
    let macd = mediaMovilPonderada(arrayCorto)-mediaMovilPonderada(arrayLargo);
    return macd;
}

async function MACDseñal(arrayDeMacds, nuevaMacd){
    if(nuevaMacd){
       await arrayDeMacds.push(nuevaMacd);
    if(arrayDeMacds.length>9){
        arrayDeMacds.shift();
        
    }}

    return mediaMovilPonderada(arrayDeMacds);

}

async function histograma(MACD, señal){
    let histogr = MACD - señal;
    return histogr;
}

async function indicadorTendenciaSchaff(arrayCorto, arrayLargo,arrayMACDs, datosStream){

    let macd = MACD(arrayCorto, 23, arrayLargo, 50, datosStream);
    arrayMACDs.push(macd);
    if(arrayMACDs.length>10){
        arrayMACDs.shift();
    }
    let estocasticoRapidoK= estocasticoRapido(arrayMACDs);
    let estocasticoLentoD=estocasticoLento(arrayMACDs);

    let Schaff = 100 * (macd - estocasticoRapidoK) / (estocasticoLentoD - estocasticoRapidoK);
    return Schaff;

}

module.exports={
    calculadoraRSI,
    mediaMovil,
    mediaMovilPonderada,
    bandasDeBolinger,
    estocasticoRapido,
    estocasticoLento,
    MACD,
    MACDseñal,
    histograma,
    indicadorTendenciaSchaff,

}


//RSI> se saca sobre 14 cierres de mercado (necesarios 15 para calcular)
// si < 30 sobrevendido ---- si >70 sobrecomprado ------ = 50 mercado lateralizado
// precios desde mas viejo a mas nuevo...cotejar como vienen de la api
//funcionamiento cotejado con internet---- de diez!!
function calculadoraRSI(arrayListaDeprecios){
       
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
    avgU= sumaCierresPositivos/cantidadPositivos;
    //console.log("avgU " + avgU)
    avgD= sumaCierresNegativos/cantidadNegativos;
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
    let precios =  arrayDePrecios;
    let sumatoria=0;
    let mediaMovil=0;
    for (let i = 0; i < precios.length; i++) {
        sumatoria += precios[i];
    }
    mediaMovil= sumatoria/precios.length;
    return mediaMovil;

}  

//checkeada con Ejemplos de internet ---- de diez!!!
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

//checkeada con Ejemplos de internet ---- de diez!!!
async function desviacionEstandar(ArrayEsto,media){
   
    
    let diferencias = 0;
    for (let i = 0; i < ArrayEsto.length; i++) {
        
        diferencias += Math.pow((ArrayEsto[i] - await media),2)
        
    }
    
    let desviacion = Math.sqrt(diferencias/(ArrayEsto.length-1))
   
    return desviacion;
}

//Para volatilidad y tendencias, margen amplio mayor volatilidad, mayores precios sobre la media o rompe linea superior 
// probable cambio de tnedencia
//20 periodos
async function bandasDeBolinger(arrayParaBolinger){
  
    let bandaMedia= await mediaMovil(arrayParaBolinger);
    let desvEstandar= await  desviacionEstandar(arrayParaBolinger,bandaMedia);
    let bandaSuperior = bandaMedia+(2*desvEstandar);
    let bandaInferior = bandaMedia-(2*desvEstandar);
    let bandasBolinger= [bandaSuperior,bandaMedia, bandaInferior]
    return bandasBolinger;
    
}


// k > 80% sobrecomprada------ k<20% sobrevendido
// implementar luego estocastico lento para => la linea k debe cruzar D , abajo arriba comprar, arriba hacia abajo vender (implementar luego estocastico lento)
// terminado sin contratar porque no hay con que
async function estocasticoK(ArrayEsto,ArrayEstoRapido, valorEsto){
  
  
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
    valorEsto.shift()
    let cierre= ArrayEsto[ArrayEsto.length-1];
    let k =100*((cierre - valorMin)/(valorMax-valorMin))
    valorEsto.push(k);
    if(ArrayEstoRapido.length>=5){
        ArrayEstoRapido.shift();
    }
    ArrayEstoRapido.push(k)
}
//si k cruza de abajo arriba d abrir compra o cerrar venta si k cruza de arriba abajo a d abrir venta o cerrar compra
// terminado sin contrastar porque no hay con que
async function estocasticoD(ArrayDeEstoRapidos, valorEstoD){
   
    valorEstoD.push(await mediaMovil(ArrayDeEstoRapidos));
    if(valorEstoD.length>2){valorEstoD.shift()};
}


async function comparadorEstocasticos(estoKV, estoDV, senial){

    if(estoKV[0]>  estoDV[1] && estoKV[0]< estoDV[0]){
        senial[0] = "Comprar/Cerrar venta"
    }
    if(estoKV[0]< estoDV[1] && estoKV[0]> estoDV[0]){
        senial[0] = "Vender/Cerrar compra"
    }

}




async function MACD(arrayCorto, arrayLargo, MACDs){
      
    let macd =  mediaMovilPonderada(arrayCorto)-mediaMovilPonderada(arrayLargo);
    MACDs.push(macd);
    return macd; //linea para forzar el await en el indicador schaff
}





async function indicadorTendenciaSchaff(arrayCorto, arrayLargo,MACDs,schaffV){
    let nada=[];
    let valorK=[];
    let valorD=[]
    estocasticoK(MACDs,nada, valorK);
    estocasticoD(MACDs, valorD);
    let macfalso=[];
    let SCmacd;
    mmc = mediaMovilPonderada(arrayCorto);
    mml= mediaMovilPonderada(arrayLargo)
   
    SCmacd = await MACD(await mmc, await mml,macfalso)
    

    schaffV.push(100 * (SCmacd - valorK[0]) / (valorD[0] - valorK[0]));
    

}

module.exports={
    calculadoraRSI,
    mediaMovil,
    mediaMovilPonderada,
    bandasDeBolinger,
    estocasticoK,
    estocasticoD,
    MACD,
    indicadorTendenciaSchaff,
    comparadorEstocasticos,

}
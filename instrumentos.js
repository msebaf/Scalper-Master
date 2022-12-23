

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

async function mediaMovilSuavizada(arraySuavizadas, promedioMovil, vela){
    let SMMA;
    let suma=0;
        if(promedioMovil.length==0){
            SMMA = ((arraySuavizadas[0]+arraySuavizadas[1])/2)
            for(i= 2; i< arraySuavizadas.length; i++){
                for (let k = 0; k < i; k++) {
                
                    suma+= arraySuavizadas[k];
                   
                    SMMA= (suma-SMMA + arraySuavizadas[i])/(i)
                    promedioMovil[0]= SMMA;
                    
                }
                suma=0
            }
        }
        else{
            for(i= 0; i< arraySuavizadas.length; i++){

                    suma+= arraySuavizadas[i]   
            }
            SMMA= (suma - promedioMovil[0] +parseFloat(vela.k.c))/arraySuavizadas.length
            arraySuavizadas.push[SMMA]
            if(arraySuavizadas.length>250){
                arraySuavizadas.shift()
            }
            promedioMovil[0]=SMMA;
        }
        
        return SMMA;
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

async function WilliamsPercentRange(maximos, minimos, closePrice, WPC){
    
    let maximo = Math.max(...maximos)
    let minimo = Math.min(...minimos);
    WPC.push((maximo-closePrice)/(maximo-minimo)*-100)
    if(WPC.length>9){
        WPC.shift()
    }
}

async function ATR(velas, ATRs, cierreAnterior){
    let v1,v2,v3;
    if(ATRs.length == 0){
        
        let valoresMayoresPorPeriodo =[]
        
        for (let i =46 ; i < 61; i++){
            v1=parseFloat(velas[i][2])- parseFloat(velas[i][3])
            v2 = Math.abs(parseFloat(velas[i][2])- parseFloat(velas[i-1][4]))
            v3 = Math.abs(parseFloat(velas[i][3])- parseFloat(velas[i-1][4]))
            valoresMayoresPorPeriodo.push(Math.max(v1,v2,v3))
            cierreAnterior.push(parseFloat(velas[i][4]))
           
        }
        
        ATRs.push(mediaMovil(valoresMayoresPorPeriodo));
    }
    else{
        let RangoVerdaderUltimo;
        v1= parseFloat(velas.k.h) - parseFloat(velas.k.l);
            v2 = Math.abs(parseFloat(velas.k.h) - cierreAnterior[0])
            v3 = Math.abs(parseFloat(velas.k.l)- cierreAnterior[0])
            RangoVerdaderUltimo= Math.max(v1,v2,v3)
            
            cierreAnterior.push(parseFloat(velas.k.c))
            cierreAnterior.shift();
        let atrAnt = await ATRs[0]
        ATRs.push(((atrAnt*13)+RangoVerdaderUltimo)/14);
        ATRs.shift();
    }

}

async function CCI(velas, CCIs, preciosTipicos14p){
    let precioTipicoActual;
    let MdiaTipicos;
    

    if(preciosTipicos14p.length == 0){
    for (let i =46 ; i < 61; i++){
        preciosTipicos14p.push((parseFloat(velas[i][2])+parseFloat(velas[i][3])+parseFloat(velas[i][4]))/3)
        precioTipicoActual = (parseFloat(velas[i][2])+parseFloat(velas[i][3])+parseFloat(velas[i][4]))/3
    }
    MdiaTipicos =await mediaMovil(preciosTipicos14p);
    CCIs.push((precioTipicoActual- MdiaTipicos)/(0.015* await desviacionEstandar(preciosTipicos14p,MdiaTipicos)))
   
    
    
}
else{
    precioTipicoActual = (parseFloat(velas.k.h)+parseFloat(velas.k.l)+parseFloat(velas.k.c))/3
    preciosTipicos14p.push(precioTipicoActual);
    preciosTipicos14p.shift()
    MdiaTipicos = await mediaMovil(preciosTipicos14p);
    CCIs.push((precioTipicoActual- MdiaTipicos)/(0.015* await desviacionEstandar(preciosTipicos14p,MdiaTipicos)))
    CCIs.shift()
   
}

}

async function supertrendACtualiador(vela, upperLevel, lowerLevel, atr){
    
        upperLevel[0]=(((parseFloat(vela.k.h) +parseFloat(vela.k.l))/2) + 1 *atr[0])
        lowerLevel[0]=(((parseFloat(vela.k.h) +parseFloat(vela.k.l))/2) - 1 *atr[0])
    
  
}
async function supertrendComparador(upperLevel, lowerLevel, price, indicador, controladorSeñales){
    if(price > upperLevel[0]){
        indicador[0] = "RED//SELL"
        controladorSeñales.push(indicador[0]);
    }
    else if(price< lowerLevel[0]){
        indicador[0] = "GREEN//BUY"
        controladorSeñales.push(indicador[0]);
    }
    else{
        indicador[0] = "No Signal"
    }
}

async function experimentalAlligator(labios, mandibula, dientes,promedioMobilAlliLabio,promedioMobilAlliDiente,promedioMobilAlliMandibula, arrayLabio,arrayDiente, arrayMandibula, vela){
    arrayLabio.shift();
    arrayDiente.shift()
    arrayMandibula.shift()
    let velaBis;
    if(vela){
    velaBis = JSON.parse(JSON.stringify(vela))
    velaBis.k.c = ((parseFloat(velaBis.k.h)+parseFloat(velaBis.k.l))/2).toString();
    }
    let nuevolabio =  mediaMovilSuavizada(arrayLabio, promedioMobilAlliLabio,velaBis)
    let nuevoDiente = mediaMovilSuavizada(arrayDiente, promedioMobilAlliDiente,velaBis)
    let nuevaManibula = mediaMovilSuavizada(arrayMandibula, promedioMobilAlliMandibula,velaBis)
    labios.push(await nuevolabio);
    mandibula.push(await nuevaManibula);
    dientes.push(await nuevoDiente);
    if(labios.length>10){
        labios.shift
    }
    if(mandibula.length>10){
        mandibula.shift()
    }
    if(dientes.length>10){
        dientes.shift()
    }


}

async function gator(valoresPositivos, valoresNegativos,codigoColor, labios, mandibulas, dientes){
    let colorP;
    let colorN;
    let valoresN= [...valoresNegativos];
    let valoresP = [...valoresPositivos];
    codigoColor[0]=codigoColor[1] 
     for (let i = 0; i <await  mandibulas.length; i++) {
        valoresP[i]= (Math.abs(mandibulas[i]- await dientes[i]));
        valoresPositivos[i]= await valoresP[i]
        valoresN[i]= Math.abs(dientes[i]-await labios[i]);
        valoresNegativos[i]= await valoresN[i]
     }
     for (let i = 1; i < valoresN.length; i++) {
            if(await valoresP[i]>await valoresP[i-1]){
                colorP="VERDE"
            }
            else if(await valoresP[i]<await valoresP[i-1]){
                colorP="ROJO";
            }
            if(await valoresN[i]>await valoresN[i-1]){
                colorN="VERDE"
            }
            else if(await valoresN[i]<await valoresN[i-1]){
                colorN="ROJO"
            }

           codigoColor[i] =  `(${colorP}-${colorN})`;
         
     }
     
    

}

async function DMI(velas,DMpositivo14d, DMnegativo14d, DIpositivo, DInegativo,maxVelaAnt, minVElaAnt, cierreVelaAnt, TR14, DX, ADX){
 


 let v1,v2,v3;
 let DMp;
 let DMn;
 
 if(DIpositivo.length==0){
    for(let i =47; i<61;i++){
        
        if(DMnegativo14d.length==0){
            DMnegativo14d[0]=0
            DMpositivo14d[0]=0;
            TR14[0]=0
         for (let k = i-14; k < i; k++) {
            DMp=parseFloat(velas[k][2]) - parseFloat(velas[k-1][2])
            DMn=parseFloat(velas[k][3]) - parseFloat(velas[k-1][3])
            if(DMp>DMn && DMp>0){            
           DMpositivo14d[0] += DMp
            }
            else{
                DMpositivo14d[0]+=0
            }
            if(DMn>DMp && DMn>0){            
                DMnegativo14d[0] += DMn
                 }
                 else{
                     DMnegativo14d[0]+=0
                 }
           v1 = parseFloat(velas[k][2])- parseFloat(velas[k][3])
          v2 = parseFloat(velas[k][2])- parseFloat(velas[k-1][4])
           v3 = parseFloat(velas[k-1][4])- parseFloat(velas[k][3])
           
          tr= Math.max(v1,v2,v3)
          TR14[0]+= tr;
           minVElaAnt[0]= parseFloat(velas[k][3])
           maxVelaAnt[0] = parseFloat(velas[k][2])
           cierreVelaAnt[0]= parseFloat(velas[k][4])
          
    
   
       
    }
    
    }
    else{ 

        DMp=parseFloat(velas[i][2]) - parseFloat(velas[i-1][2])
        DMn=parseFloat(velas[i][3]) - parseFloat(velas[i-1][3])
        if(DMp>DMn && DMp>0){            
            DMpositivo14d[0] = DMpositivo14d[0]- (DMpositivo14d[0]/14) + (DMp)
        }
        else{
            DMpositivo14d[0]+=0
        }
        if(DMn>DMp && DMn>0){            
            DMnegativo14d[0] = DMnegativo14d[0] - (DMnegativo14d[0]/14) + (DMn)
             }
             else{
                 DMnegativo14d[0]+=0
             }
      
       
    v1 = parseFloat(velas[i][2])- parseFloat(velas[i][3])
    v2 = parseFloat(velas[i][4])- cierreVelaAnt[0]
    v3 = cierreVelaAnt[0]- parseFloat(velas[i][3])
    tr= Math.max(v1,v2,v3)
    TR14[0]= TR14[0] - (TR14[0]/14) + tr;
    
    let DIn =(DMnegativo14d[0]/TR14[0])*100
    let DIp= (DMpositivo14d[0]/TR14[0])*100
    
    DInegativo.push(DIn);
    DIpositivo.push(DIp)
    DX.push(Math.abs((DIp-DIn)/ (DIp+DIn)))
    if(ADX.length==0){
        ADX[0]= DX[0]
    }
    else{
        ADX[0]= ((ADX[0]*13+DX[DX.length-1])/14)
    }

        minVElaAnt[0]= parseFloat(velas[i][3])
        maxVelaAnt[0] = parseFloat(velas[i][2])
        cierreVelaAnt[0] = parseFloat(velas[i][4])


    if(DInegativo.length>14){
        DInegativo.shift()
        DIpositivo.shift()
        DX.shift()
    }
       
       
    }

    }
    

}
   
else{

    DMp=parseFloat(parseFloat(velas.k.h)- maxVelaAnt[0])
    DMn=parseFloat(parseFloat(velas.k.l)- minVElaAnt[0])
    if(DMp>DMn && DMp>0){            
        DMpositivo14d[0] = DMpositivo14d[0]- (DMpositivo14d[0]/14) + (DMp)
    }
    else{
        DMpositivo14d+=0;
    }
    if(DMn>DMp && DMn>0){            
        DMnegativo14d[0] = DMnegativo14d[0] - (DMnegativo14d[0]/14) + (DMn)
         }
         else{
             DMnegativo14d[0]+=0
         }
    

   
    v1 = parseFloat(velas.k.h)- parseFloat(velas.k.l)
    v2 = parseFloat(velas.k.c)- cierreVelaAnt[0]
    v3 = cierreVelaAnt[0]- parseFloat(velas.k.l)
    tr= Math.max(v1,v2,v3)
    TR14[0]= TR14[0] - (TR14[0]/14) + tr;
   
    minVElaAnt[0]= parseFloat(velas.k.l)
        maxVelaAnt[0] = parseFloat(velas.k.h)
        cierreVelaAnt[0] = parseFloat(velas.k.c)
       

        let DIn =(DMnegativo14d[0]/TR14[0])*100
        let DIp= (DMpositivo14d[0]/TR14[0])*100
        
        DInegativo.push(DIn);
        DIpositivo.push(DIp)
        DX.push(100*(Math.abs((DIp-DIn)/ (DIp+DIn))))
        ADX[0]= ((ADX[0]*13+DX[DX.length-1])/14)

        if(DInegativo.length>14){
            DInegativo.shift()
            DIpositivo.shift()
            DX.shift()
        }
        
       
    
}



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
    WilliamsPercentRange,
    ATR,
    CCI,
    supertrendACtualiador,
    supertrendComparador,
    mediaMovilSuavizada,
    experimentalAlligator,
    gator,
    DMI,

}
require('dotenv').config();
const fs = require("fs");
const WebSocket = require("ws");
const wsPrice = new WebSocket(`${process.env.STREAM_URL}btcusdt@markPrice@1s`) //par que queiro monitorear, que quiero(market price), lapso
const wsCandles1m = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_1m`) //stream candles
const wsCandles3m = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_3m`)
const wsCandles5m = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_5m`)
const wsCandles15m = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_15m`)
const wsCandles30m = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_30m`)
const api = require("./api");
const instrumentos= require("./instrumentos")
const funciones = require("./funciones")



let candels1m;
let candels3m;
let candels5m;
let candels15m;
let candels30m
let precio;
let preciosCandles61de3m=[];
let preciosCandles61de5m=[];
let preciosCandles61de15m=[];
let preciosCandles61de30m=[];

//-----------SuperTrend------

let signalST=[];
let lowerLevel=[];
let upperLevel= [];
let controladorSeñales=[]

//------------CCI------------
let CCIs=[];
let CCIpreciosTipicos14p=[];

//------------ATR------------
let ATRs=[];
let ATRcierreAnt=[]
//----------------Williams Percent Range---------
let maximosWilliam1m=[];
let minimosWilliam1m=[];
let WPC1m=[]
//-------------------shaff------------------
let schaff1s=[]
let schaff1m=[]
let schaff3m=[]
//------------------datos para MACD----------
let valoresMACDlargo1s=[];
let valoresMACDcorto1s=[];
let MACDs1s=[];
let senial1s;
let histograma1s=[];
let valoresMACDlargo1m=[];
let valoresMACDcorto1m=[];
let MACDs1m=[];
let senial1m;
let histograma1m=[];
let valoresMACDlargo3m=[];
let valoresMACDcorto3m=[];
let MACDs3m=[];
let senial3m;
let histograma3m=[];
//-----------------datos para estocasticos--------
let contadorInicial=60;
let contadorVelasMinuto = 0;
let valoresEstocastico=[];
let estocasticoKV=[];
let ArrayEstocasticosRapidos=[]
let estocasticoDV=[];
let senialEstocastica=["esperando señal"];
let valoresEstocastico1m=[];
let estocasticoKV1m=[];
let ArrayEstocasticosRapidos1m=[]
let estocasticoDV1m=[];
let senialEstocastica1m=["esperando señal"];
let valoresEstocastico3m=[];
let estocasticoKV3m=[];
let ArrayEstocasticosRapidos3m=[]
let estocasticoDV3m=[];
let senialEstocastica3m=["esperando señal"];
//-------------------variables 24hs
let tendencia24Hs=[];
let valoresCalculo24hs=[]
let maximo24=[0];
let minimo24=[99999999];
let maximosMayoresAlMAximo24=[0];
let entreRangoACt24=[0]
let minimosMenoresAlMinimo24=[0];
let mediaPonderada24H;
//------------------------variables 5 horas
let tendencia5Hs=[];
let valoresCalculo5hs=[]
let maximo5=[0];
let minimo5=[99999999];
let maximosMayoresAlMAximo5=[0];
let minimosMenoresAlMinimo5=[0];
let entreRangoACt5=[0]

let mediaPonderada5H;
//------------------------variables 2hs
let tendencia2Hs=[];
let valoresCalculo2hs=[]
let maximo2=[0];
let minimo2=[99999999];
let maximosMayoresAlMAximo2=[0];
let minimosMenoresAlMinimo2=[0];
let entreRangoACt2=[0]
let mediaPonderada2H;
//---------------------variables 1h
let tendencia1H=[];
var valoresCalculo1hs=[]
let maximo1=[0];
let minimo1=[99999999];
let maximosMayoresAlMAximo1=[0];
let minimosMenoresAlMinimo1=[0];
let entreRangoACt1=[0]
let mediaPonderada1H;
//---------------------minuto
let tendenciaM=[];
var valoresCalculoM=[]
let maximoM =[0];
let minimoM=[99999999];
let maximosMayoresAlMAximoM=[0];
let minimosMenoresAlMinimoM=[0];
let entreRangoACtM=[0]
let mediaPonderada1M;
//------datos RSI---
let datosParaRSIhora= [];
var RSIhora;
let datosParaRSIminuto= [];
var RSIminuto;
let posicionAbierta=false;
let precioDeEntrada=0.0;
let unrealizedProfit=0;
let tipoDePosicion ="Ninguna"
let tipoDeMercado2H1H1M;
//---------media Movil Suavizada------
let arraySuavizadas1h=[];
let promedioMovilSuave1h=[];
let arraySuavizadas1m=[];
let promedioMovilSuave1m=[];
//--------alligator xperimental------
let labios =[]
let mandibula=[];
let dientes=[];
let promedioMobilAlliLabio=[];
let promedioMobilAlliDiente=[] 
let promedioMobilAlliMandibula=[]
let arrayLabio= [];
let arrayManbdibula=[];
let arrayDiente=[];

//-----------Gator---------
let valoresPositivos=[];
valoresPositivos[0]=0;
valoresPositivos[1]=0;
let valoresNegativos=[];
valoresNegativos[0]=0
valoresNegativos[1]=0
let codigoColor=[];
codigoColor[0]= "ignorar";
codigoColor[1]="ignorar"

//-----------DMI------------
let DIpositivo=[]
let DInegativo=[]
let maxVelaAnt=[] 
let minVelaAnt=[]
let DMpositivo14d=[]
let DMnegativo14d=[]
let TR14=[]
let cierreVelaAnt=[]
let DX= [];
let ADX=[]







//-------------------------fin inicializacion--------------






async function operar(){
candels1m=  await api.recuperarHistoricoVelas("btcusdt", "1m", 61);
candels3m= await api.recuperarHistoricoVelas("btcusdt", "3m", 61);
candels5m= await api.recuperarHistoricoVelas("btcusdt", "5m", 61);
candels15m= await api.recuperarHistoricoVelas("btcusdt", "15m", 61);
candels30m= await api.recuperarHistoricoVelas("btcusdt", "30m", 61);

instrumentos.ATR(candels1m, ATRs, ATRcierreAnt);
instrumentos.CCI(candels1m, CCIs, CCIpreciosTipicos14p)



funciones.recoleccionDeDAtos(candels1m, valoresCalculo1hs,61)
funciones.recoleccionDeDAtos(candels3m, preciosCandles61de3m, 61);
funciones.recoleccionDeDAtos(candels5m, preciosCandles61de5m, 61)
funciones.recoleccionDeDAtos(candels15m, preciosCandles61de15m,61)
funciones.recoleccionDeDAtos(candels30m, preciosCandles61de30m, 61)
datosParaRSIhora = preciosCandles61de3m.slice(26);
valoresCalculo2hs = preciosCandles61de5m.slice(36);
valoresCalculo5hs= preciosCandles61de15m.slice(40);
valoresCalculo24hs = preciosCandles61de30m.slice(12);

funciones.recoleccionDeDAtos(candels1m, maximosWilliam1m,61,14,2)
funciones.recoleccionDeDAtos(candels1m, minimosWilliam1m,61,14,3)

arraySuavizadas1h = [...valoresCalculo1hs]
instrumentos.mediaMovilSuavizada(arraySuavizadas1h,promedioMovilSuave1h);

let arraySuavizadoParaalligator1h=[];
for (let i = 0; i < 61; i++) {
    arraySuavizadoParaalligator1h.push((parseFloat(candels1m[i][2])+ parseFloat(candels1m[i][3]))/2)
    
}

instrumentos.DMI(candels1m,DMpositivo14d,DMnegativo14d, DIpositivo, DInegativo, maxVelaAnt, minVelaAnt, cierreVelaAnt,TR14,DX, ADX)




arrayDiente = arraySuavizadoParaalligator1h.slice(47);
arrayManbdibula = arraySuavizadoParaalligator1h.slice(39);
arrayLabio = arraySuavizadoParaalligator1h.slice(52);
instrumentos.experimentalAlligator(labios,mandibula,dientes,promedioMobilAlliLabio, promedioMobilAlliDiente, promedioMobilAlliMandibula, arrayLabio,arrayDiente,arrayManbdibula)



await funciones.actualizarTendencias(valoresCalculo1hs, tendencia1H, maximo1,minimo1,maximosMayoresAlMAximo1, minimosMenoresAlMinimo1,entreRangoACt1);
await funciones.actualizarTendencias(valoresCalculo5hs, tendencia5Hs, maximo5,minimo5,maximosMayoresAlMAximo5, minimosMenoresAlMinimo5,entreRangoACt5);
await funciones.actualizarTendencias(valoresCalculo2hs, tendencia2Hs, maximo2,minimo2,maximosMayoresAlMAximo2, minimosMenoresAlMinimo2,entreRangoACt2);
await funciones.actualizarTendencias(valoresCalculo24hs, tendencia24Hs, maximo24,minimo24,maximosMayoresAlMAximo24, minimosMenoresAlMinimo24,entreRangoACt24); 
 
valoresMACDlargo3m = [...datosParaRSIhora]
valoresMACDcorto3m = datosParaRSIhora.slice(14)

 valoresEstocastico1m = valoresCalculo1hs.slice(36);

 valoresEstocastico3m = datosParaRSIhora.slice(10);
 
 
 valoresMACDlargo1m = valoresCalculo1hs.slice(26)
 valoresMACDcorto1m = valoresCalculo1hs.slice(40)
 valoresMACDlargo3m = valoresCalculo1hs.slice(26)
 valoresMACDcorto3m = valoresCalculo1hs.slice(40)
 
 
 let k=0;
 while(k<5){
    for (let i = 0; i < 20; i++) {
        instrumentos.estocasticoK(valoresEstocastico1m, ArrayEstocasticosRapidos1m, estocasticoKV1m)
        instrumentos.estocasticoK(valoresEstocastico3m, ArrayEstocasticosRapidos3m, estocasticoKV3m)
    }
    valoresEstocastico1m.shift();
    valoresEstocastico3m.shift();
    k++
 }
 k=0;
 while(k<9){
    instrumentos.MACD(valoresMACDcorto1m.slice(0,13), valoresMACDlargo1m.slice(0,27), MACDs1m)
    valoresMACDcorto1m.shift();
    valoresMACDlargo1m.shift();
    instrumentos.MACD(valoresMACDcorto3m.slice(0,13), valoresMACDlargo3m.slice(0,27), MACDs3m)
    valoresMACDcorto3m.shift();
    valoresMACDlargo3m.shift();
    k++;
 }

senial1m = instrumentos.mediaMovilPonderada(MACDs1m)
senial3m = instrumentos.mediaMovilPonderada(MACDs3m)

histograma1m.push(MACDs1m[MACDs1m.length-1]-senial1m)
histograma3m.push(MACDs3m[MACDs3m.length-1]-senial3m)


 instrumentos.estocasticoD(ArrayEstocasticosRapidos1m, estocasticoDV1m);
 instrumentos.estocasticoD(ArrayEstocasticosRapidos3m, estocasticoDV3m);
 datosParaRSIhora.splice(0, 10)

 RSIhora= instrumentos.calculadoraRSI(datosParaRSIhora);

 mediaPonderada2H= instrumentos.mediaMovilPonderada(valoresCalculo2hs);
 mediaPonderada5H= instrumentos.mediaMovilPonderada(valoresCalculo5hs);
 mediaPonderada24H= instrumentos.mediaMovilPonderada(valoresCalculo24hs);


 
 


 wsCandles1m.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    
    let datos = JSON.parse(event.data)
    contadorVelasMinuto++
    let contInicializadorMMS=0
    if(contadorVelasMinuto==2){
        contadorVelasMinuto=0;
        while(contInicializadorMMS<4){
            arraySuavizadas1m.push(parseFloat(datos.k.c))
            contInicializadorMMS++
        }
        if(contInicializadorMMS==4){
            instrumentos.mediaMovilSuavizada(arraySuavizadas1m, promedioMovilSuave1m, datos)
        }
        valoresCalculoM.push(datos.k.c);
        
        
    }
    if(valoresCalculoM.length>61){
        valoresCalculoM.shift();
        funciones.actualizarTendencias(valoresCalculoM,tendenciaM,maximoM,minimoM, maximosMayoresAlMAximoM, minimosMenoresAlMinimoM, entreRangoACtM);
        mediaPonderada1M =  instrumentos.mediaMovilPonderada(valoresCalculoM);
    }
    
   if(datos.k.x==true){
    instrumentos.ATR(datos, ATRs, ATRcierreAnt);
    instrumentos.CCI(datos, CCIs, CCIpreciosTipicos14p)
    instrumentos.supertrendACtualiador(datos,upperLevel,lowerLevel,ATRs)
    instrumentos.mediaMovilSuavizada(arraySuavizadas1h,promedioMovilSuave1h,datos);
    instrumentos.experimentalAlligator(labios,mandibula,dientes,promedioMobilAlliLabio, promedioMobilAlliDiente, promedioMobilAlliMandibula, arrayLabio,arrayDiente,arrayManbdibula,datos)
    instrumentos.gator(valoresPositivos, valoresNegativos, codigoColor, labios,mandibula,dientes);
    instrumentos.DMI(datos,DMpositivo14d,DMnegativo14d, DIpositivo, DInegativo, maxVelaAnt, minVelaAnt, cierreVelaAnt,TR14,DX,ADX)
    
    


    valoresCalculo1hs.push(datos.k.c);
    valoresCalculo1hs.shift();
    mediaPonderada1H= instrumentos.mediaMovilPonderada(valoresCalculo1hs);
    funciones.actualizarTendencias(valoresCalculo1hs, tendencia1H, maximo1,minimo1,maximosMayoresAlMAximo1, minimosMenoresAlMinimo1,entreRangoACt1);
    valoresEstocastico1m.push(datos.k.c);
        valoresEstocastico1m.shift()
        
        instrumentos.estocasticoK(valoresEstocastico1m,ArrayEstocasticosRapidos1m, estocasticoKV1m);
        instrumentos.estocasticoD(ArrayEstocasticosRapidos1m, estocasticoDV1m);
        instrumentos.comparadorEstocasticos(estocasticoKV1m, estocasticoDV1m, senialEstocastica1m);

        valoresMACDcorto1m.push(datos.k.c);
        valoresMACDcorto1m.shift();
        valoresMACDlargo1m.push(datos.k.c)
        valoresMACDlargo1m.shift();
       
        instrumentos.MACD(valoresMACDcorto1m, valoresMACDlargo1m, MACDs1m);
        if(MACDs1m.length>10){
        MACDs1m.shift()
        }
        senial1m = instrumentos.mediaMovilPonderada(MACDs1m.slice(1))
        histograma1m.push(MACDs1m[MACDs1m.length-1]-senial1m);
        if(histograma1m.length>9){
            histograma1m.shift();
        }

        
        instrumentos.indicadorTendenciaSchaff(valoresCalculo1hs.slice(38), valoresCalculo1hs.slice(11),[...MACDs1m],schaff1m)
        if(schaff1m.length>9){
            schaff1m.shift()
        }
        
        maximosWilliam1m.push(datos.k.h);
        minimosWilliam1m.push(datos.k.l);
        maximosWilliam1m.shift();
        minimosWilliam1m.shift();
        instrumentos.WilliamsPercentRange(maximosWilliam1m,minimosWilliam1m,datos.k.c,WPC1m);

        
    }
        
}
wsCandles3m.onmessage=(event)=>{
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
    datosParaRSIhora.push(datos.k.c);
    datosParaRSIhora.shift()
     RSIhora = instrumentos.calculadoraRSI(datosParaRSIhora);
     valoresEstocastico3m.push(datos.k.c);
        valoresEstocastico3m.shift()
        
        instrumentos.estocasticoK(valoresEstocastico3m,ArrayEstocasticosRapidos3m, estocasticoKV3m);
        instrumentos.estocasticoD(ArrayEstocasticosRapidos3m, estocasticoDV3m);
        instrumentos.comparadorEstocasticos(estocasticoKV3m, estocasticoDV3m, senialEstocastica3m)

        valoresMACDcorto3m.push(datos.k.c);
        valoresMACDcorto3m.shift();
        valoresMACDlargo3m.push(datos.k.c)
        valoresMACDlargo3m.shift();
       
        instrumentos.MACD(valoresMACDcorto3m, valoresMACDlargo3m, MACDs3m);
        if(MACDs3m.length>10){
        MACDs3m.shift()
        }
        senial3m = instrumentos.mediaMovilPonderada(MACDs3m.slice(1))
        histograma3m.push(MACDs3m[MACDs3m.length-1]-senial3m);
        if(histograma3m.length>9){
            histograma3m.shift();
        }
        preciosCandles61de3m.push(datos.k.c);
        preciosCandles61de3m.shift();
        instrumentos.indicadorTendenciaSchaff(preciosCandles61de3m.slice(38), preciosCandles61de3m.slice(11),[...MACDs3m],schaff3m);
        if(schaff3m.length>9){
            schaff3m.shift()
        }
        
   }
}
wsCandles5m.onmessage=(event)=>{
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
    valoresCalculo2hs.push(datos.k.c);
        valoresCalculo2hs.shift();
        mediaPonderada2H= instrumentos.mediaMovilPonderada(valoresCalculo2hs);
        funciones.actualizarTendencias(valoresCalculo2hs, tendencia2Hs, maximo2,minimo2,maximosMayoresAlMAximo2, minimosMenoresAlMinimo2,entreRangoACt2);
   }
}
 
wsCandles15m.onmessage=(event)=>{
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
        valoresCalculo5hs.push(datos.k.c);
        valoresCalculo5hs.shift();
        mediaPonderada5H= instrumentos.mediaMovilPonderada(valoresCalculo5hs);
        funciones.actualizarTendencias(valoresCalculo5hs, tendencia5Hs, maximo5,minimo5,maximosMayoresAlMAximo5, minimosMenoresAlMinimo5,entreRangoACt5);
    }
}

wsCandles30m.onmessage=(event)=>{
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
    valoresCalculo24hs.push(datos.k.c)
        valoresCalculo24hs.shift();
        mediaPonderada24H= instrumentos.mediaMovilPonderada(valoresCalculo24hs);
        funciones.actualizarTendencias(valoresCalculo24hs, tendencia24Hs, maximo24,minimo24,maximosMayoresAlMAximo24, minimosMenoresAlMinimo24,entreRangoACt24);
       
    }
}

wsPrice.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
   console.clear();
   
   

    const datos = JSON.parse(event.data);

   

    precio = parseFloat(datos.p);
    
    datosParaRSIminuto.push(precio);
    if(datosParaRSIminuto.length>60){
        datosParaRSIminuto.shift()
    }
    RSIminuto = instrumentos.calculadoraRSI(datosParaRSIminuto);
    
    if(valoresCalculoM.length<60){
        posicionAbierta= undefined
        valoresEstocastico.push(precio);
        if(valoresEstocastico.length>20){
        valoresEstocastico.shift()}
        valoresMACDlargo1s.push(precio)
        if(valoresMACDlargo1s.length>26){
            valoresMACDlargo1s.shift()
        }
        valoresMACDcorto1s.push(precio)
        if(valoresMACDcorto1s.length>12){
            valoresMACDcorto1s.shift()
        }
        instrumentos.MACD(valoresMACDcorto1s, valoresMACDlargo1s, MACDs1s);
        if(MACDs1s.length>10){
            MACDs1s.shift()
        }
        senial1s= instrumentos.mediaMovilPonderada(MACDs1s.slice(1))
        histograma1s.push((MACDs1s[MACDs1s.length-1]-senial1s))
        if(histograma1s.length>9){
            histograma1s.shift()
        }
        
        console.log(`------- Cargando datos ${contadorInicial- valoresCalculoM.length}`)
        
    }
    else if(valoresCalculoM.length == 60){
        posicionAbierta= false;
        valoresEstocastico.push(precio);
        if(valoresEstocastico.length>20){
        valoresEstocastico.shift()}
        valoresMACDlargo1s.push(precio)
        if(valoresMACDlargo1s.length>26){
            valoresMACDlargo1s.shift()
        }
        valoresMACDcorto1s.push(precio)
        if(valoresMACDcorto1s.length>12){
            valoresMACDcorto1s.shift()
        }
        instrumentos.MACD(valoresMACDcorto1s, valoresMACDlargo1s, MACDs1s);
        if(MACDs1s.length>10){
            MACDs1s.shift()
        }
        senial1s= instrumentos.mediaMovilPonderada(MACDs1s.slice(1))
        histograma1s.push((MACDs1s[MACDs1s.length-1]-senial1s))
        if(histograma1s.length>9){
            histograma1s.shift()
        }
        console.log(`Iniciando programa`)
    }
    else{
        
        instrumentos.supertrendComparador(upperLevel, lowerLevel, precio, signalST,controladorSeñales);
        valoresEstocastico.push(precio);
       
        valoresEstocastico.shift()
    
        instrumentos.estocasticoK(valoresEstocastico,ArrayEstocasticosRapidos, estocasticoKV);
        instrumentos.estocasticoD(ArrayEstocasticosRapidos, estocasticoDV);
        instrumentos.comparadorEstocasticos(estocasticoKV, estocasticoDV, senialEstocastica);

        valoresMACDlargo1s.push(precio)
        
            valoresMACDlargo1s.shift()
        
        valoresMACDcorto1s.push(precio)
        
            valoresMACDcorto1s.shift()
        
        instrumentos.MACD(valoresMACDcorto1s, valoresMACDlargo1s, MACDs1s);
         
            MACDs1s.shift()
        
        senial1s= instrumentos.mediaMovilPonderada(MACDs1s.slice(1))
        histograma1s.push((MACDs1s[MACDs1s.length-1]-senial1s))
        histograma1s.shift()

        instrumentos.indicadorTendenciaSchaff(valoresCalculoM.slice(38), valoresCalculoM.slice(11),[...MACDs1s],schaff1s)
        if(schaff1s.length>9){
            schaff1s.shift()
        }
        
    //recuperar datos posicion
if(posicionAbierta==true){
    api.consultarPosicion("btcusdt")
.then(data => {
    precioDeEntrada=data[0].entryPrice;
    unrealizedProfit =data[0].unRealizedProfit;
    
    
})
.catch(err => {
    console.log(err)
    posicionAbierta=false;
    precioDeEntrada=undefined;
})}

console.clear()
console.log(`---------------------------------------------${precio}-------------------------------------------`)
console.log(`24HS ----  Pmax: ${maximo24} ----Pmin: ${minimo24} ---- TENDENCIA: ${tendencia24Hs}-----MPond: ${mediaPonderada24H}`)
console.log(`5HS ----  Pmax: ${maximo5} ----Pmin: ${minimo5} ---- TENDENCIA: ${tendencia5Hs}-----MPond: ${mediaPonderada5H}`)
console.log(`2HS ----  Pmax: ${maximo2} ----Pmin: ${minimo2} ---- TENDENCIA: ${tendencia2Hs}-----MPond: ${mediaPonderada2H}`)
console.log(`1HS ----  Pmax: ${maximo1} ----Pmin: ${minimo1} ---- TENDENCIA: ${tendencia1H} -----MPond: ${mediaPonderada1H} --- MSuavizada 1H ${promedioMovilSuave1h}`)
console.log(`1M ----  Pmax: ${maximoM} ----Pmin: ${minimoM} ---- TENDENCIA: ${tendenciaM} -----MPond: ${mediaPonderada1M}--- MSuavizada 1m ${promedioMovilSuave1m}`)
console.log(`Entrada: ${precioDeEntrada}  |  Profit: ${unrealizedProfit}  |  Tipo de Posicion ${tipoDePosicion}  |  Pabierta : ${posicionAbierta}`);
console.log(`---------------------------------------------- RSI -----------------------------------------------------`)
console.log(`RSI Hora: ${RSIhora}  |  RSI minuto: ${RSIminuto} `)
console.log(`-----------------------------Estocastico 1 segundo---------------------- ${valoresEstocastico.length} - ${ArrayEstocasticosRapidos.length}`)
console.log(`Estocastico K 1s: ${estocasticoKV}  | estocastico D 1s: ${estocasticoDV}  |  Señal 1s : ${senialEstocastica}`)
console.log(`-----------------------------Estocastico 1 minuto----------------------  ${valoresEstocastico1m.length} - ${ArrayEstocasticosRapidos1m.length}`)
console.log(`Estocastico K 1M: ${estocasticoKV1m}  |  Estocastico K 1M: ${estocasticoDV1m}  | Señal 1m : ${senialEstocastica1m}`)
console.log(`-----------------------------Estocastico 3 minutos---------------------- ${valoresEstocastico3m.length} - ${ArrayEstocasticosRapidos3m.length}`)
console.log(`Estocastico K 3M:  ${estocasticoKV3m}  |  Estocastico K 3M: ${estocasticoDV3m}  |  Señal 3m : ${senialEstocastica3m}`)
console.log(`-----------------------------MACD 1 segundo---------------------- ${valoresMACDlargo1m.length} - ${valoresMACDcorto1m.length}`)
console.log(`MACD 1s: ${MACDs1s[MACDs1s.length-1]}  |  Señal  1s: ${senial1s}  |  Histograma 1s : ${histograma1s}`)
console.log(`-----------------------------MACD 1 minuto---------------------- ${valoresMACDlargo1m.length}  -  ${valoresMACDcorto1m.length}`)
console.log(`MACD 1M:  ${MACDs1m[MACDs1m.length-1]}  |  Señal  1M:  ${senial1m}  |  Histograma 1M :  ${histograma1m}`)
console.log(`-----------------------------MACD 3 minutos---------------------- ${valoresMACDlargo3m.length}  - ${valoresMACDcorto3m.length}`)
console.log(`MACD 3M:  ${MACDs3m[MACDs3m.length-1]}  |  Señal  3M:  ${senial3m}  |  Histograma 3M :  ${histograma3m}`)
console.log(`-------------------------Schaft----------------------------------`)
console.log(`SCHAFF 1s: ${schaff1s}  |  SCHAFF 1m: ${schaff1m}  |  SCHAFF 3m: ${schaff3m}`)
console.log(`-------------------------Williams Percent Range 1m (14m)----------------------------------`)
console.log(`WPC 1m: ${WPC1m}`)
console.log(`-------------------------ATR (volatilidad) 1m (14m)  y  CCI----------------------------------`)
console.log(`ATR 1m: ${ATRs}  -----------------  CCI : ${CCIs}  ------------- SuperTrend : ${signalST}`)
console.log(`upper : ${upperLevel} -- lower: ${lowerLevel} -- precio : ${precio}`)
//console.log(`control :  ${controladorSeñales}`)
console.log(`---------------------------Experimental Alligator---------------------------------------------`)
console.log(`Mandibula : ${mandibula} ---- Dientes: ${dientes}----- Labios: ${labios}`)
console.log(`--------------------------Gator---------------------------------`)
console.log(`Positivos: ${valoresPositivos}`)
console.log(`Negativos: ${valoresNegativos}`)
console.log(`Cod color: ${codigoColor}`)
console.log(`------------------------------DMI------------------`)
console.log(`Positivos : ${DIpositivo}`)
console.log(`Negativos : ${DInegativo}`)
console.log(`ADX : ${ADX}`)
console.log(`DX : ${DX}`)
console.log(MACDs1m.length, MACDs1s.length, MACDs3m.length, valoresMACDcorto1m.length, valoresMACDcorto1s.length
    , valoresMACDcorto3m.length, valoresMACDlargo1m.length, valoresMACDlargo1s.length, valoresMACDlargo3m.length, histograma1m.length,
    histograma1s.length, histograma3m.length)


    


/* Combinaciones de tendencias de mercado para 2h, 1h y 1M
    1           2           3           4   
     2h up       2h down     2h down     2h down
     1h up       1h up       1h down     1h up
     1M up       1M up       1M up       1M down

    5           6           7           8
     2h up       2h up       2h up       2h down
     1h down     1h down     1h up       1h down
     1M up       1M down     1M down     1M down

     9
      2h lat
      1h lat
      1M lat


*/

if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 1;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 2;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 3;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 4;
}

else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 5;
}
else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 6;
}
else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 7;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA" || tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 8;
}
else if((tendencia2Hs=="LATERAL") && (tendencia1H=="LATERAL")
&&(tendenciaM=="LATERAL")){
    tipoDeMercado2H1H1M = 9;
}


 //-------------------------empiezan las operacion----------------

if(posicionAbierta==false){
/*  if(tipoDeMercado2H1H1M==1){
    let mediaMaxMin = (maximo1+ minimo1)/2;
    if(precio <= (maximo1-mediaMaxMin*0.000236)){
            console.log("abrir posicion")
            posicionAbierta=true;
            tipoDePosicion="BUY"
            unrealizedProfit=0
            api.abrirPosicion("BTCUSDT", "0.001","BUY")
                .then(data => {
                    precioDeEntrada=precio;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
            
                
        }
 }
 if(tipoDeMercado2H1H1M==2){
    let mediaMaxMin = (maximo1+ minimo1)/2;
    if(precio <= (maximo1-mediaMaxMin*0.000236)){
        console.log("abrir posicion")
        posicionAbierta=true;
        tipoDePosicion="BUY"
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                precioDeEntrada=data;
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
                precioDeEntrada=undefined;
            })
        

    }
}

if(tipoDeMercado2H1H1M==3){
    if(RSIhora <= 33){
        console.log("abrir posicion")
        posicionAbierta=true;
        tipoDePosicion="BUY"
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                precioDeEntrada=data;
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
                precioDeEntrada=undefined;
            })
        }
    else if(RSIhora>=77){
        console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
    }
    }

if(tipoDeMercado2H1H1M==4){
    if(RSIhora <= 33){
        console.log("abrir posicion")
        posicionAbierta=true;
        tipoDePosicion="BUY"
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                precioDeEntrada=data;
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
                precioDeEntrada=undefined;
            })
        }
    else if(RSIhora>=77){
        console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
    }
    }


if(tipoDeMercado2H1H1M==5){
    if(RSIhora <= 33){
        console.log("abrir posicion")
        posicionAbierta=true;
        tipoDePosicion="BUY"
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                precioDeEntrada=data;
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
                precioDeEntrada=undefined;
            })
        }
    else if(RSIhora>=77){
        console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
    }
    
}

if(tipoDeMercado2H1H1M==6){
    let mediaMaxMin = (maximo1+ minimo1)/2;
    if(precio >= (minimo1+mediaMaxMin*0.0003)){
            console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
            

        }
}

if(tipoDeMercado2H1H1M==7){
    if(RSIhora <= 33){
        console.log("abrir posicion")
        posicionAbierta=true;
        tipoDePosicion="BUY"
        api.abrirPosicion("BTCUSDT", "0.001","BUY")
            .then(data => {
                precioDeEntrada=data;
                console.log(data)
                
            })
            .catch(err => {
                console.log(err)
                posicionAbierta=false;
                precioDeEntrada=undefined;
            })
        }
    else if(RSIhora>=77){
        console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
    }
    
}

if(tipoDeMercado2H1H1M==8){
    let mediaMaxMin = (maximo1+ minimo1)/2;
    if(precio >= (minimo1+mediaMaxMin*0.0003)){
            console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
            

        }
}

if(tipoDeMercado2H1H1M==9){
    
    if(precio < (mediaPonderada1M)){
            console.log("abrir posicion")
            posicionAbierta=true;
            tipoDePosicion="BUY"
            api.abrirPosicion("BTCUSDT", "0.001","BUY")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
            

        }

} */
  /* if(RSIhora<=30 && valoresCalculoM.length==61){
    console.log("abrir posicion")
            posicionAbierta=true;
            tipoDePosicion="BUY"
            api.abrirPosicion("BTCUSDT", "0.001","BUY")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    fs.appendFile("seesion-log.txt", `Apertura \n 24hs: ${tendencia24Hs}; 5hs: ${tendencia5Hs}; 2hs: ${tendencia2Hs}; 1hs: ${tendencia1H}; M: ${tendenciaM}\n Precio: ${precio}; Tipo: BUY \n`, (err) => {
                        if (err)
                          console.log(err);
                        else {
                          console.log("File written successfully\n");
                         
                        }
                      });
                    
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
}
if(RSIhora>=70 && valoresCalculoM.length==61){
    console.log("abrir posicion corta")
            posicionAbierta=true;
            tipoDePosicion="SELL"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    fs.appendFile("seesion-log.txt", `Apertura \n 24hs: ${tendencia24Hs}; 5hs: ${tendencia5Hs}; 2hs: ${tendencia2Hs}; 1hs: ${tendencia1H}; M: ${tendenciaM}\n Precio: ${precio}; Tipo: SELL \n`, (err) => {
                        if (err)
                          console.log(err);
                        else {
                          console.log("File written successfully\n");
                         
                        }
                      });
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=false;
                    precioDeEntrada=undefined;
                })
            

}  

}
if(posicionAbierta==true){
    if((unrealizedProfit>0.008 || unrealizedProfit<= -0.007) && tipoDePosicion=="BUY"){
        console.log("cerrar posicion")
            posicionAbierta=false;
            tipoDePosicion="Ninguna"
            api.abrirPosicion("BTCUSDT", "0.001","SELL")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    fs.appendFile("seesion-log.txt", `Cierre \n 24hs: ${tendencia24Hs}; 5hs: ${tendencia5Hs}; 2hs: ${tendencia2Hs}; 1hs: ${tendencia1H}; M: ${tendenciaM}\n Precio Cierre: ${precio}; Tipo: SELL; profit: ${unrealizedProfit} \n`,(err) => {
                        if (err)
                          console.log(err);
                        else {
                          console.log("File written successfully\n");
                        
                        }
                      });
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=true;
                    precioDeEntrada=undefined;
                })
    }
    if((unrealizedProfit>0.008 || unrealizedProfit<= -0.007)  && tipoDePosicion=="SELL"){
        console.log("cerrar posicion")
            posicionAbierta=false;
            tipoDePosicion="Ninguna"
            api.abrirPosicion("BTCUSDT", "0.001","BUY")
                .then(data => {
                    precioDeEntrada=data;
                    console.log(data)
                    fs.appendFile("seesion-log.txt", `Cierre \n 24hs: ${tendencia24Hs}; 5hs: ${tendencia5Hs}; 2hs: ${tendencia2Hs}; 1hs: ${tendencia1H}; M: ${tendenciaM}\n PrecioCierre: ${precio}; Tipo: BUY; profit: ${unrealizedProfit} \n`,(err) => {
                        if (err)
                          console.log(err);
                        else {
                          console.log("File written successfully\n");
                          
                        }
                      });
                })
                .catch(err => {
                    console.log(err)
                    posicionAbierta=true;
                    precioDeEntrada=undefined;
                })
    }*/
}


}  

}
}
operar()





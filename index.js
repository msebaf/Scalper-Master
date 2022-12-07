require('dotenv').config();
const WebSocket = require("ws");
const ws = new WebSocket(`${process.env.STREAM_URL}btcusdt@markPrice@1s`) //par que queiro monitorear, que quiero(market price), lapso
const wsCandles = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_1m`) //stream candles

const api = require("./api");
const instrumentos= require("./instrumentos")
const funciones = require("./funciones")



let candels;
let precio;
let contadorInicial=60;
//-------------------variables 24hs
let tendencia24Hs;
let valoresCalculo24hs=[]
let maximo24;
let minimo24;
let maximosMayoresAlMAximo24=0;
let minimosMenoresAlMinimo24=0;
let entreRango24=0;
let mediaPonderada24H;
//------------------------variables 5 horas
let tendencia5Hs;
let valoresCalculo5hs=[]
let maximo5;
let minimo5;
let maximosMayoresAlMAximo5=0;
let minimosMenoresAlMinimo5=0;
let entreRango5=0;
let mediaPonderada5H;
//------------------------variables 2hs
let tendencia2Hs;
let valoresCalculo2hs=[]
let maximo2;
let minimo2;
let maximosMayoresAlMAximo2=0;
let minimosMenoresAlMinimo2=0;
let entreRango2=0;
let mediaPonderada2H;
//---------------------variables 1h
let tendencia1H;
var valoresCalculo1hs=[]
let maximo1;
let minimo1;
let maximosMayoresAlMAximo1=0;
let minimosMenoresAlMinimo1=0;
let entreRango1=0;
let mediaPonderada1H;
//---------------------minuto
let tendenciaM;
var valoresCalculoM=[]
let maximoM =0;
let minimoM=99999999;
let maximosMayoresAlMAximoM=0;
let minimosMenoresAlMinimoM=0;
let entreRangoM=0;
let mediaPonderada1M;
//------datos rsi---
let datosParaRSI= [];
var RSI;
let posicionAbierta=false;
let precioDeEntrada=0.0;
let unrealizedProfit=0;
let tipoDeMercado2H1H1M;




async function calcularTendencias(){
    candels= await api.recuperarHistoricoVelas("btcusdt", "1m", 1500);

    // -------------------------tendencia 24 hs velas 1/2 horas--------------------
    for (let i = 1500- 1440; i < 1500; i+=30) {
       
        valoresCalculo24hs.push(parseFloat(candels[i][4]))
                
    }
    maximo24= valoresCalculo24hs[0];
    console.log(maximo24);
    minimo24 = valoresCalculo24hs[0];
    console.log(minimo24);

    for (let i = 0; i <  valoresCalculo24hs.length; i++) {
        if(valoresCalculo24hs[i]>maximo24){
            maximo24= valoresCalculo24hs[i];
            maximosMayoresAlMAximo24++
        }
        else if(valoresCalculo24hs[i]<minimo24){
            minimo24= valoresCalculo24hs[i]
            minimosMenoresAlMinimo24++
        }
        else{
            entreRango24++;
        }

        
    }
    if(maximosMayoresAlMAximo24>minimosMenoresAlMinimo24 && maximosMayoresAlMAximo24 >= entreRango24*0.5){
        tendencia24Hs= "BAJISTA";
    }
    else if(maximosMayoresAlMAximo24>minimosMenoresAlMinimo24 && !(maximosMayoresAlMAximo24 >= entreRango24*0.5)){
        tendencia24Hs= "LATERAL-BAJISTA";
    }
    else if(minimosMenoresAlMinimo24>maximosMayoresAlMAximo24 && minimosMenoresAlMinimo24 >= entreRango24*0.5){

        tendencia24Hs="BAJISTA"
    }
    else if(minimosMenoresAlMinimo24>maximosMayoresAlMAximo24 && !(minimosMenoresAlMinimo24 >= entreRango24*0.5)){

        tendencia24Hs="LATERAL-BAJISTA"
    }
    else{
        tendencia24Hs="LATERAL"
    }
/* console.log("---------24 hs---------------------")
console.log(valoresCalculo24hs)
console.log(maximosMayoresAlMAximo24)
console.log(minimosMenoresAlMinimo24)
console.log(entreRango24)
console.log(tendencia24Hs) */

//------------------------------------------------tendencia 5 horas velas 1/2 hora----------------------
    for (let i = 1500- 300; i < 1500; i+=10) {
       
    valoresCalculo5hs.push(parseFloat(candels[i][4]))
            
    }
    maximo5= valoresCalculo5hs[0];
    console.log(maximo5);
    minimo5 = valoresCalculo5hs[0];
    console.log(minimo5);

    for (let i = 0; i <  valoresCalculo5hs.length; i++) {
        if(valoresCalculo5hs[i]>maximo5){
            maximo5= valoresCalculo5hs[i];
            maximosMayoresAlMAximo5++
        }
        else if(valoresCalculo5hs[i]<minimo5){
            minimo5= valoresCalculo5hs[i]
            minimosMenoresAlMinimo5++
        }
        else{
            entreRango5++;
        }

        
    }
    if(maximosMayoresAlMAximo5>minimosMenoresAlMinimo5 && maximosMayoresAlMAximo5 >= entreRango5*0.5){
        tendencia5Hs= "BAJISTA";
    }
    else if(maximosMayoresAlMAximo5>minimosMenoresAlMinimo5 && !(maximosMayoresAlMAximo5 >= entreRango5*0.5)){
        tendencia5Hs= "LATERAL-BAJISTA";
    }
    else if(minimosMenoresAlMinimo5>maximosMayoresAlMAximo5 && minimosMenoresAlMinimo5 >= entreRango5*0.5){

        tendencia5Hs="BAJISTA"
    }
    else if(minimosMenoresAlMinimo5>maximosMayoresAlMAximo5 && !(minimosMenoresAlMinimo5 >= entreRango5*0.5)){

        tendencia5Hs="LATERAL-BAJISTA"
    }
    else{
        tendencia5Hs="LATERAL"
    }
/* console.log("------5 horas-----------")
console.log(valoresCalculo5hs)
console.log(maximosMayoresAlMAximo5)
console.log(minimosMenoresAlMinimo5)
console.log(entreRango5)
console.log(tendencia5Hs) */

//-----------------tendencia 2horas periodo 5m --------------

for (let i = 1500- 150; i < 1500; i+=5) {
       
    valoresCalculo2hs.push(parseFloat(candels[i][4]))
            
    }
    maximo2= valoresCalculo2hs[0];
    console.log(maximo2);
    minimo2 = valoresCalculo2hs[0];
    console.log(minimo2);

    for (let i = 0; i <  valoresCalculo2hs.length; i++) {
        if(valoresCalculo2hs[i]>maximo2){
            maximo2= valoresCalculo2hs[i];
            maximosMayoresAlMAximo2++
        }
        else if(valoresCalculo2hs[i]<minimo2){
            minimo2= valoresCalculo2hs[i]
            minimosMenoresAlMinimo2++
        }
        else{
            entreRango2++;
        }

        
    }
    if(maximosMayoresAlMAximo2>minimosMenoresAlMinimo2 && maximosMayoresAlMAximo2 >= entreRango2*0.5){
        tendencia2Hs= "BAJISTA";
    }
    else if(maximosMayoresAlMAximo2>minimosMenoresAlMinimo2 && !(maximosMayoresAlMAximo2 >= entreRango2*0.5) && valoresCalculo2hs[0] < valoresCalculo2hs[valoresCalculo2hs.length-1]-15){
        tendencia2Hs= "LATERAL-BAJISTA";
    }
    else if(minimosMenoresAlMinimo2>maximosMayoresAlMAximo2 && minimosMenoresAlMinimo2 >= entreRango2*0.5){

        tendencia2Hs="BAJISTA"
    }
    else if(minimosMenoresAlMinimo2>maximosMayoresAlMAximo2 && !(minimosMenoresAlMinimo2 >= entreRango2*0.5) && valoresCalculo2hs[0] > valoresCalculo2hs[valoresCalculo2hs.length-1]+15){

        tendencia2Hs="LATERAL-BAJISTA"
    }
    else{
        tendencia2Hs="LATERAL"
    }
/* console.log("------2 horas-----------")
console.log(valoresCalculo2hs)
console.log(maximosMayoresAlMAximo2)
console.log(minimosMenoresAlMinimo2)
console.log(entreRango2)
console.log(tendencia2Hs) */

//-----------------tendencia 1horas periodo 1m --------------

for (let i = 1500- 60; i < 1500; i++) {
       
    valoresCalculo1hs.push(parseFloat(candels[i][4]))
            
    }
    maximo1= valoresCalculo1hs[0];
    console.log(maximo1);
    minimo1 = valoresCalculo1hs[0];
    console.log(minimo1);

    for (let i = 0; i <  valoresCalculo1hs.length; i++) {
        if(valoresCalculo1hs[i]>maximo1){
            maximo1= valoresCalculo1hs[i];
            maximosMayoresAlMAximo1++
        }
        else if(valoresCalculo1hs[i]<minimo1){
            minimo1= valoresCalculo1hs[i]
            minimosMenoresAlMinimo1++
        }
        else{
            entreRango1++;
        }

        
    }
    if(maximosMayoresAlMAximo1>minimosMenoresAlMinimo1 && maximosMayoresAlMAximo1 >= entreRango1*0.5){
        tendencia1H= "BAJISTA";
    }
    else if(maximosMayoresAlMAximo1>minimosMenoresAlMinimo1 && !(maximosMayoresAlMAximo1 >= entreRango1*0.5) && valoresCalculo1hs[0] < valoresCalculo1hs[valoresCalculo1hs.length-1]-15){
        tendencia1H= "LATERAL-BAJISTA";
    }
    else if(minimosMenoresAlMinimo1>maximosMayoresAlMAximo1 && minimosMenoresAlMinimo1 >= entreRango1*0.5){

        tendencia1H="BAJISTA"
    }
    else if(minimosMenoresAlMinimo1>maximosMayoresAlMAximo1 && !(minimosMenoresAlMinimo1 >= entreRango1*0.5) && valoresCalculo1hs[0] > valoresCalculo1hs[valoresCalculo1hs.length-1]+15){

        tendencia1H="LATERAL-BAJISTA"
    }
    else{
        tendencia1H="LATERAL"
    }
/* console.log("------1 horas-----------")
console.log(valoresCalculo1hs)
console.log(maximosMayoresAlMAximo1)
console.log(minimosMenoresAlMinimo1)
console.log(entreRango1)
console.log(minimo1);
console.log(maximo1)
console.log(tendencia1H) */

//-----------------------RSI----

for (let i = 1500-15; i < 1500; i++) {
   datosParaRSI.push(parseFloat( await candels[i][4]));
}
RSI= instrumentos.calculadoraRSI(datosParaRSI);
console.log(RSI);
// continuar con el stream actualizacion de datos criterio de compra y venta

    

}

//-------------------------fin inicializacion--------------


let contadorVelasMediaHora=0;
let contadorVelas5Minutos=0;

async function operar(){
 await calcularTendencias();
 console.log("RSI: "+RSI)
 mediaPonderada2H= instrumentos.mediaMovilPonderada(valoresCalculo2hs);
 mediaPonderada5H= instrumentos.mediaMovilPonderada(valoresCalculo5hs);
 mediaPonderada24H= instrumentos.mediaMovilPonderada(valoresCalculo24hs);


 wsCandles.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    //console. clear();
    let datos = JSON.parse(event.data)
   if(datos.k.x==true){
    datosParaRSI.push(datos.k.c);
    datosParaRSI.shift()
    RSI = instrumentos.calculadoraRSI(datosParaRSI);
    valoresCalculo1hs.push(datos.k.c);
    valoresCalculo1hs.shift();
    mediaPonderada1H= instrumentos.mediaMovilPonderada(valoresCalculo1hs);
    funciones.actualizarTendencias(valoresCalculo1hs,tendencia1H,maximo1,minimo1,maximosMayoresAlMAximo1,minimosMenoresAlMinimo1,entreRango1);
    contadorVelasMediaHora++;
    contadorVelas5Minutos++;
    if(contadorVelasMediaHora==30){
        valoresCalculo24hs.push(datos.k.c)
        valoresCalculo24hs.shift();
        contadorVelasMediaHora=0;
        mediaPonderada24H= instrumentos.mediaMovilPonderada(valoresCalculo24hs);
        funciones.actualizarTendencias(valoresCalculo24hs,tendencia24Hs,maximo24,minimo24,maximosMayoresAlMAximo24,minimosMenoresAlMinimo24,entreRango24)
        valoresCalculo5hs.push(datos.k.c);
        valoresCalculo5hs.shift();
        mediaPonderada5H= instrumentos.mediaMovilPonderada(valoresCalculo5hs);
        funciones.actualizarTendencias(valoresCalculo5hs,tendencia5Hs,maximo5,minimo5,maximosMayoresAlMAximo5,minimosMenoresAlMinimo5,entreRango5)
    }
    if(contadorVelas5Minutos==5){
        valoresCalculo2hs.push(datos.k.c);
        valoresCalculo2hs.shift();
        contadorVelas5Minutos=0;
        mediaPonderada2H= instrumentos.mediaMovilPonderada(valoresCalculo2hs);
        funciones.actualizarTendencias(valoresCalculo2hs,tendencia2Hs,maximo2,minimo2,maximosMayoresAlMAximo2,minimosMenoresAlMinimo2,entreRango2)
    }
    }
        
}
 
ws.onmessage= (event) => {  //web socket tiene conexion constante y me envia la infoen el tiemp estipulado
    //console. clear();
    mediaPonderada1M =  instrumentos.mediaMovilPonderada(valoresCalculoM);
    const datos = JSON.parse(event.data);
    precio = parseFloat(datos.p);
    valoresCalculoM.push(precio);
    if(valoresCalculoM.length>60){
        valoresCalculoM.shift();
    }
    
    if(valoresCalculoM.length<60){
        console.clear()
        contadorInicial--;
        console.log(`------- Inicializando datos ${contadorInicial}`)
    }
    else{
        
        minimosMenoresAlMinimoM=0;
        maximosMayoresAlMAximoM=0;
        for (let i = 0; i <  valoresCalculoM.length; i++) {
        if(valoresCalculoM[i]>maximoM){
            maximoM= valoresCalculoM[i];
            maximosMayoresAlMAximoM++
        }
        else if(valoresCalculoM[i]<minimoM){
            minimoM= valoresCalculoM[i]
            minimosMenoresAlMinimoM++
        }
        else{
            entreRangoM++;
        }

        
    }
    if(maximosMayoresAlMAximoM>minimosMenoresAlMinimoM && maximosMayoresAlMAximoM >= entreRangoM*0.5){
        tendenciaM= "BAJISTA";
    }
    else if(maximosMayoresAlMAximoM>minimosMenoresAlMinimoM && !(maximosMayoresAlMAximoM >= entreRangoM*0.5) && valoresCalculoM[0] < valoresCalculoM[valoresCalculoM.length-1]-15){
        tendenciaM= "LATERAL-BAJISTA";
    }
    else if(minimosMenoresAlMinimoM>maximosMayoresAlMAximoM && minimosMenoresAlMinimoM >= entreRangoM*0.5){

        tendenciaM="BAJISTA"
    }
    else if(minimosMenoresAlMinimoM>maximosMayoresAlMAximoM && !(minimosMenoresAlMinimoM >= entreRangoM*0.5) && valoresCalculoM[0] > valoresCalculoM[valoresCalculoM.length-1]+15){

        tendenciaM="LATERAL-BAJISTA"
    }
    else{
        tendenciaM="LATERAL"
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


    console.clear();
    
    console.log(`---------------------------------------------${precio}-------------------------------------------`)
    console.log(`24HS ----  Pmax: ${maximo24} ----Pmin: ${minimo24} ---- TENDENCIA: ${tendencia24Hs}-----MPond: ${mediaPonderada24H}`)
    console.log(`5HS ----  Pmax: ${maximo5} ----Pmin: ${minimo5} ---- TENDENCIA: ${tendencia5Hs}-----MPond: ${mediaPonderada5H}`)
    console.log(`2HS ----  Pmax: ${maximo2} ----Pmin: ${minimo2} ---- TENDENCIA: ${tendencia2Hs}-----MPond: ${mediaPonderada2H}`)
    console.log(`1HS ----  Pmax: ${maximo1} ----Pmin: ${minimo1} ---- TENDENCIA: ${tendencia1H} -----MPond: ${mediaPonderada1H}`)
    console.log(`1M ----  Pmax: ${maximoM} ----Pmin: ${minimoM} ---- TENDENCIA: ${tendenciaM} -----MPond: ${mediaPonderada1M}`)
    console.log(`RSI: ${RSI}`)
    console.log(`Entrada: ${precioDeEntrada}`);
    console.log(`Profit: ${unrealizedProfit}`);




    }
}

/* Combinaciones de tendencias de mercado para 2h, 1h y 1M
    1           2           3           4   
     2h up       2h down     2h down     2h down
     1h up       1h up       1h down     1h up
     1M up       1M up       1M up       1M down

    5           6           7           8
     2h up       2h up       2h up       2h down
     1h down     1h down     1h up       1h down
     1M up       1M down     1M down     1M down


*/
if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA")){
    tipoDeMercado2H1H1M = 1;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA")){
    tipoDeMercado2H1H1M = 2;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA")){
    tipoDeMercado2H1H1M = 3;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA")){
    tipoDeMercado2H1H1M = 4;
}

else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="ALCISTA"|| tendenciaM=="LATERAL-ALCISTA")){
    tipoDeMercado2H1H1M = 5;
}
else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA")){
    tipoDeMercado2H1H1M = 6;
}
else if((tendencia2Hs=="ALCISTA"|| tendencia2Hs=="LATERAL-ALCISTA") && (tendencia1H=="ALCISTA"|| tendencia1H=="LATERAL-ALCISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA")){
    tipoDeMercado2H1H1M = 7;
}
else if((tendencia2Hs=="BAJISTA"|| tendencia2Hs=="LATERAL-BAJISTA") && (tendencia1H=="BAJISTA"|| tendencia1H=="LATERAL-BAJISTA")
&&(tendenciaM=="BAJISTA"|| tendenciaM=="LATERAL-BAJISTA")){
    tipoDeMercado2H1H1M = 8;
}


 //-------------------------empiezan las operacion----------------

 //----estrategia todo ALCISTA
 if(tipoDeMercado2H1H1M==1){
        let difMinMedia = maximo1- minimo1;
        if(precio <= (maximo1-difMinMedia*0.03)){
            console.log("abrir posicion")
            posicionAbierta=true;
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



}
operar()





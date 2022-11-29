require('dotenv').config();
const WebSocket = require("ws");
const ws = new WebSocket(`${process.env.STREAM_URL}btcusdt@markPrice@1s`) //par que queiro monitorear, que quiero(market price), lapso
const wsCandles = new WebSocket(`${process.env.STREAM_URL}btcusdt@kline_1m`) //stream candles

const api = require("./api");
const instrumentos= require("./instrumentos")
let posicionAbierta= false;


let candels;
//-------------------variables 24hs
let tendencia24Hs;
let valoresCalculo24hs=[]
let maximo24;
let minimo24;
let maximosMayoresAlMAximo24=0;
let minimosMenoresAlMinimo24=0;
let entreRango24=0;
//------------------------variables 5 horas
let tendencia5Hs;
let valoresCalculo5hs=[]
let maximo5;
let minimo5;
let maximosMayoresAlMAximo5=0;
let minimosMenoresAlMinimo5=0;
let entreRango5=0;
//------------------------variables 2hs
let tendencia2Hs;
let valoresCalculo2hs=[]
let maximo2;
let minimo2;
let maximosMayoresAlMAximo2=0;
let minimosMenoresAlMinimo2=0;
let entreRango2=0;
//---------------------variables 1h
let tendencia1H;
let valoresCalculo1hs=[]
let maximo1;
let minimo1;
let maximosMayoresAlMAximo1=0;
let minimosMenoresAlMinimo1=0;
let entreRango1=0;
//------datos rsi---
let datosParaRSI= [];
var RSI;

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
        tendencia24Hs= "ALCISTA";
    }
    else if(maximosMayoresAlMAximo24>minimosMenoresAlMinimo24 && !(maximosMayoresAlMAximo24 >= entreRango24*0.5)){
        tendencia24Hs= "LATERAL-ALCISTA";
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
console.log("---------24 hs---------------------")
console.log(valoresCalculo24hs)
console.log(maximosMayoresAlMAximo24)
console.log(minimosMenoresAlMinimo24)
console.log(entreRango24)
console.log(tendencia24Hs)

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
        tendencia5Hs= "ALCISTA";
    }
    else if(maximosMayoresAlMAximo5>minimosMenoresAlMinimo5 && !(maximosMayoresAlMAximo5 >= entreRango5*0.5)){
        tendencia5Hs= "LATERAL-ALCISTA";
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
console.log("------5 horas-----------")
console.log(valoresCalculo5hs)
console.log(maximosMayoresAlMAximo5)
console.log(minimosMenoresAlMinimo5)
console.log(entreRango5)
console.log(tendencia5Hs)

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
        tendencia2Hs= "ALCISTA";
    }
    else if(maximosMayoresAlMAximo2>minimosMenoresAlMinimo2 && !(maximosMayoresAlMAximo2 >= entreRango2*0.5) && valoresCalculo2hs[0] < valoresCalculo2hs[valoresCalculo2hs.length-1]-15){
        tendencia2Hs= "LATERAL-ALCISTA";
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
console.log("------2 horas-----------")
console.log(valoresCalculo2hs)
console.log(maximosMayoresAlMAximo2)
console.log(minimosMenoresAlMinimo2)
console.log(entreRango2)
console.log(tendencia2Hs)

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
        tendencia1H= "ALCISTA";
    }
    else if(maximosMayoresAlMAximo1>minimosMenoresAlMinimo1 && !(maximosMayoresAlMAximo1 >= entreRango1*0.5) && valoresCalculo1hs[0] < valoresCalculo1hs[valoresCalculo1hs.length-1]-15){
        tendencia1H= "LATERAL-ALCISTA";
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
console.log("------1 horas-----------")
console.log(valoresCalculo1hs)
console.log(maximosMayoresAlMAximo1)
console.log(minimosMenoresAlMinimo1)
console.log(entreRango1)
console.log(minimo1);
console.log(maximo1)
console.log(tendencia1H)

//-----------------------RSI----

for (let i = 1500-15; i < 1500; i++) {
   datosParaRSI.push(parseFloat( await candels[i][4]));
}
RSI= instrumentos.calculadoraRSI(datosParaRSI);
console.log(RSI);
// continuar con el stream actualizacion de datos criterio de compra y venta

    

}

calcularTendencias()
console.log("RSI: "+RSI)



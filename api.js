const axios = require("axios");
const crypto = require("crypto");

const apiKey= process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;
const apiUrl= process.env.API_URL;

async function abrirPosicion(symbol, quantity, side = "BUY"){
    const data = {symbol, side, quantity, type:"MARKET"}

    const timestamp = Date.now();
    const recvWindow = 60000; //tiempo de atraso que tolero en la ejecucion

    const signature = crypto.createHmac('sha256', apiSecret)
                            .update(`${new URLSearchParams({...data, timestamp, recvWindow}).toString()}`)
                            .digest('hex');

    const newData= {...data, timestamp, recvWindow, signature};
    const queryString = `?${new URLSearchParams(newData).toString()}`;
    const resultado = await axios({
        method: 'POST',
        url: `${apiUrl}v1/order${queryString}`,
        headers: { 'X-MBX-APIKEY': apiKey}
    });

    return resultado.data;

}



async function recuperarHistoricoVelas(symbol, interval, limit){
    const timestamp = Date.now();
    
                
    const data = {symbol, interval, limit};
    const queryString = `?${new URLSearchParams(data).toString()}`;

    const resultado = await axios({
        method: "GET",
        url:`${apiUrl}v1/klines${queryString}`,
        headers: { 'X-MBX-APIKEY': apiKey}
    });
    const datos= {...resultado.data}
    return datos
}




async function consultarPosicion(symbol){
    const data = {symbol}

    const timestamp = Date.now();


    const signature = crypto.createHmac('sha256', apiSecret)
                            .update(`${new URLSearchParams({...data, timestamp}).toString()}`)
                            .digest('hex');

    const newData= {...data, timestamp, signature};
    const queryString = `?${new URLSearchParams(newData).toString()}`;
    const resultado = await axios({
        method: 'GET',
        url: `${apiUrl}v2/positionRisk${queryString}`,
        headers: { 'X-MBX-APIKEY': apiKey}
    });

    return resultado.data;

}




module.exports ={
    abrirPosicion,
    recuperarHistoricoVelas,
    consultarPosicion,
}
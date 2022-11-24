


async function calculadoraRSI(arrayListaDeprecios){

    let precios= await arrayListaDeprecios;
    let sumaCierresPositivos=0;
    let sumaCierresNegativos=0;
    let cantidadPositivos=0;
    let cantidadNegativos=0;
    let avgU=0;
    let avgD=0;
    let periodo =  precios.length-1;
    let relativeStrenght = 0;

    for (let i = 1; i < precios.length; i++) {
        if(precios[i]>precios[i-1]){
            sumaCierresPositivos+=(precios[i]-precios[i-1]);
            cantidadPositivos++
        }
        else{
            sumaCierresNegativos+= (precios[i-1]-precios[i]);
            cantidadNegativos++;
        }
        
    }
    console.log(sumaCierresNegativos)
    console.log(sumaCierresPositivos)
    avgU= sumaCierresPositivos/periodo;
    console.log("avgU " + avgU)
    avgD= sumaCierresNegativos/periodo;
    console.log("avgD " + avgD)
    try{
    relativeStrenght= avgU/avgD;
    console.log("RS "+ relativeStrenght)
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

async function mediaMovilPonderada(arrayDePrecios){
    //mayot prioridad a precios mas recientes
    let precios = await arrayDePrecios;
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

module.exports={
    calculadoraRSI,
    mediaMovil,
    mediaMovilPonderada,
}

const api = require("./api");
const instrumentos = require("./instrumentos")


async function recoleccionDeDAtos(candels, dataStorage, cantDAtos){
       
    for (let i = 0; i < cantDAtos; i++) {
      
        dataStorage.push(parseFloat(candels[i][4]))
                
    }
   


}

//toman una vela extra como punto de cmienzo por eso por ej para calcular 1 hora con velas de 1 minuto tomo 61 velas
async function actualizarTendencias(valoresCalculoPeriodo,tendenciaPeriodo, maximoPeriodo, minimoPerido,maximosMayoresAlMAximo,
    minimosMenoresAlMinimo, entreRangoACt){
    


   if(maximoPeriodo[0]==0){
    maximoPeriodo[0]= valoresCalculoPeriodo[0]
   }
   else{
    maximoPeriodo[0]= 0;
   }
   if(minimoPerido[0]==99999999){
    minimoPerido[0]= valoresCalculoPeriodo[0]
   }else{
    minimoPerido[0]=99999999
   }
 
    entreRangoACt[0]= valoresCalculoPeriodo[0]
   
   

    maximosMayoresAlMAximo[0]=0;
    minimosMenoresAlMinimo[0]=0;
    let entreRangoMayores=0;
    let entreRangoMenores=0
    


    for (let i = 1; i < valoresCalculoPeriodo.length; i++) {
        if(valoresCalculoPeriodo[i]>maximoPeriodo[0]){
            maximoPeriodo[0]= valoresCalculoPeriodo[i];
            maximosMayoresAlMAximo[0]++
        }
        else if(valoresCalculoPeriodo[i]<minimoPerido[0]){
            minimoPerido[0]= valoresCalculoPeriodo[i]
            minimosMenoresAlMinimo[0]++
        }
        else if(valoresCalculoPeriodo[i]> entreRangoACt[0]){
            entreRangoMayores++;
            entreRangoACt[0]=valoresCalculoPeriodo[i]
        }
        else{
            entreRangoMenores++
            entreRangoACt[0]=valoresCalculoPeriodo[i]
        }

        
    }
    
    if((maximosMayoresAlMAximo[0]>minimosMenoresAlMinimo[0]) && (entreRangoMayores>entreRangoMenores+10)&&(valoresCalculoPeriodo[0]<valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){
        tendenciaPeriodo[0]= "ALCISTA";
    }
    else if((maximosMayoresAlMAximo[0]>minimosMenoresAlMinimo[0]) && (entreRangoMayores >entreRangoMenores)&&(valoresCalculoPeriodo[0]<valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){
        tendenciaPeriodo[0]= "LATERAL-ALCISTA";
    }
    else if((minimosMenoresAlMinimo[0]>maximosMayoresAlMAximo[0]) && (entreRangoMenores > entreRangoMayores+10)&&(valoresCalculoPeriodo[0]>valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){

        tendenciaPeriodo[0]="BAJISTA"
    }
    else if((minimosMenoresAlMinimo[0]>maximosMayoresAlMAximo[0]) && (entreRangoMenores >entreRangoMayores)&&(valoresCalculoPeriodo[0]>valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){

        tendenciaPeriodo[0]="LATERAL-BAJISTA"
    }
    else{
        tendenciaPeriodo[0]="LATERAL"
    }

    
}

module.exports={
    actualizarTendencias,
    recoleccionDeDAtos,
}
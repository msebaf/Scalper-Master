const { mediaMovil } = require("./instrumentos");

async function actualizarTendencias(valoresCalculoPeriodo,tendenciaPeriodo, maximoPeriodo, minimoPerido,maximosMayoresAlMAximo,
    minimosMenoresAlMinimo, entreRangoPeriodo, entreRangoACt){
    

  
    //maximoPeriodo= valoresCalculoPeriodo[0];
    //console.log(maximoPeriodo);
    //minimoPerido = valoresCalculoPeriodo[0];
   //console.log(minimoPerido);
   if(maximoPeriodo==0){
    maximoPeriodo=mediaMovil(await valoresCalculoPeriodo)
   }
   if(minimoPerido==99999999){
    minimoPerido=mediaMovil(await valoresCalculoPeriodo)
   }
   
    maximosMayoresAlMAximo=0;
    minimosMenoresAlMinimo=0;
    entreRangoPeriodo=0
    entreRangoMayores=0;
    entreRangoMenores=0
    


    for (let i = 0; i < valoresCalculoPeriodo.length; i++) {
        if(valoresCalculoPeriodo[i]>maximoPeriodo){
            maximoPeriodo= valoresCalculoPeriodo[i];
            maximosMayoresAlMAximo++
        }
        else if(valoresCalculoPeriodo[i]<minimoPerido){
            minimoPerido= valoresCalculoPeriodo[i]
            minimosMenoresAlMinimo++
        }
        else if(valoresCalculoPeriodo[i]> entreRangoACt){
            entreRangoMayores++;
        }
        else{
            entreRangoMenores++
        }

        
    }
   
    if((maximosMayoresAlMAximo>minimosMenoresAlMinimo) && (entreRangoMayores>entreRangoMenores+10)&&(valoresCalculoPeriodo[0]<valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){
        tendenciaPeriodo= "ALCISTA";
    }
    else if((maximosMayoresAlMAximo>minimosMenoresAlMinimo) && !(entreRangoMayores >entreRangoMenores)&&(valoresCalculoPeriodo[0]<valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){
        tendenciaPeriodo= "LATERAL-ALCISTA";
    }
    else if((minimosMenoresAlMinimo>maximosMayoresAlMAximo) && (entreRangoMenores > entreRangoMayores+10)&&(valoresCalculoPeriodo[0]>valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){

        tendenciaPeriodo="BAJISTA"
    }
    else if((minimosMenoresAlMinimo>maximosMayoresAlMAximo) && !(entreRangoMenores >entreRangoMayores)&&(valoresCalculoPeriodo[0]>valoresCalculoPeriodo[valoresCalculoPeriodo.length-1])){

        tendenciaPeriodo="LATERAL-BAJISTA"
    }
    else{
        tendenciaPeriodo="LATERAL"
    }

    maximoPeriodo= 0;
    minimoPerido=99999999
    for (let i = 0; i <  valoresCalculoPeriodo.length; i++) {
        if(valoresCalculoPeriodo[i]>maximoPeriodo){
            maximoPeriodo= valoresCalculoPeriodo[i];
            
        }
        else if(valoresCalculoPeriodo[i]<minimoPerido){
            minimoPerido= valoresCalculoPeriodo[i]
            
        }
        

        
    }
/* console.log("---------algo hs---------------------")
console.log(new Date().toLocaleString())
console.log(valoresCalculoPeriodo)
console.log(maximosMayoresAlMAximo)
console.log(minimosMenoresAlMinimo)
console.log(entreRangoPeriodo)
console.log(tendenciaPeriodo) */
}

module.exports={
    actualizarTendencias,
}
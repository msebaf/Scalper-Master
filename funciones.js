async function actualizarTendencias( valoresCalculoPeriodo,tendenciaPeriodo, maximoPeriodo, minimoPerido,maximosMayoresAlMAximo,
    minimosMenoresAlMinimo, entreRangoPeriodo){
    

  
    //maximoPeriodo= valoresCalculoPeriodo[0];
    //console.log(maximoPeriodo);
    //minimoPerido = valoresCalculoPeriodo[0];
   //console.log(minimoPerido);
    maximosMayoresAlMAximo=0;
    minimosMenoresAlMinimo=0;

    for (let i = 0; i <  valoresCalculoPeriodo.length; i++) {
        if(valoresCalculoPeriodo[i]>maximoPeriodo){
            maximoPeriodo= valoresCalculoPeriodo[i];
            maximosMayoresAlMAximo++
        }
        else if(valoresCalculoPeriodo[i]<minimoPerido){
            minimoPerido= valoresCalculoPeriodo[i]
            minimosMenoresAlMinimo++
        }
        else{
            entreRangoPeriodo++;
        }

        
    }
    if(maximosMayoresAlMAximo>minimosMenoresAlMinimo && maximosMayoresAlMAximo >= entreRangoPeriodo*0.5){
        tendenciaPeriodo= "ALCISTA";
    }
    else if(maximosMayoresAlMAximo>minimosMenoresAlMinimo && !(maximosMayoresAlMAximo >= entreRangoPeriodo*0.5)){
        tendenciaPeriodo= "LATERAL-ALCISTA";
    }
    else if(minimosMenoresAlMinimo>maximosMayoresAlMAximo && minimosMenoresAlMinimo >= entreRangoPeriodo*0.5){

        tendenciaPeriodo="BAJISTA"
    }
    else if(minimosMenoresAlMinimo>maximosMayoresAlMAximo && !(minimosMenoresAlMinimo >= entreRangoPeriodo*0.5)){

        tendenciaPeriodo="LATERAL-BAJISTA"
    }
    else{
        tendenciaPeriodo="LATERAL"
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
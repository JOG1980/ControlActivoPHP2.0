
//obtiene la fecha de hoy con el formato YYYY-mm-dd hh:ii:ss.ms
function fechaHoy(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	var hh = today.getHours();
	var ii = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
	var ss = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds();
	var ms = today.getMilliseconds();

	today = yyyy + '-' + mm + '-' + dd +" "+hh+":"+ii+":"+ss+"."+ms;
	return today;
}


//valida un email, si ftene formato correcto devuelve tru de lo contrario false
function validarEmail(email){
    var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(email)) {
       return true;
    } 

    return false;
}


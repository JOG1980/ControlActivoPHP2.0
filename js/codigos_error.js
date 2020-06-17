
//el siguiente objeto tendra almacenados los codigos de error definidos
var lista_codigos = new Object();

lista_codigos.codigo_1054 = "Columna desconocida";
lista_codigos.codigo_1062 = "Ya existe un registro en la base de datos con la misma información unica. Revise e introduzca informacion no duplicada.";
lista_codigos.codigo_1451 = "Existe registros en otras tablas dependientes de este registro, primero se deben eliminar los otros registros. Esto se puede deber a que este registro puede ser una llave foránea de registros en otra tabla.";
lista_codigos.codigo_1452 = "No se puede agregar o utilizar.";

//funcion para ivocar los codigos, esta funcion sera llamada en otros .js
/*function validarCodigoError(codigos){
	var mensajes_error="";
   	for(var i=0 ; i<codigos.length ; i++){
		var num_codigo = codigos[i];
		var nombre_codigo = "codigo_"+num_codigo;
		mensajes_error += lista_codigos[nombre_codigo]+"\r\n";
		
	}

	return mensajes_error; 
	//alert(codigos[0]);
}//end function validarCodigoError*/	

function validarCodigoError(codigo){
	var mensajes_error="";
   	var nombre_codigo = "codigo_"+codigo;
	mensajes_error += lista_codigos[nombre_codigo];
	return mensajes_error; 
	//alert(codigos[0]);
}//end function validarCodigoError


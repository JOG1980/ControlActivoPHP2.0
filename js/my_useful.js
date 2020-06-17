
//*************************************** FUNCIONES UTILES GENERALES **********************************************************************//


//-----------------------------------------------------------------------------------------------------
//deja solo el contenido del cuerpo del html 
function cleanHTMLContent(str){
	str = str.toLowerCase();
	var body_pos = str.indexOf("<body>");
	str = str.substring(body_pos);
	str = str.replace("<body>","<div>");
	str = str.replace("</body>","</div>");
	str = str.replace("</html>","");
	return str;
}


//----------------------------------------------------------------------------------------------------------------------
//esta funcion mide la dimen del atributo de un objeto. Si es un arreglo devuelve un valor igual o mayor a dos
//si es un objeto solo devuelve 1
function elementoLength(elemento){
	  var dimension =0;
	  //validamos si existe referencia del elemento, de no ser asi (undefined) se significa que hay 0 elementos 
	  //si es diferente de undefined entonces sabemos que 1 o mas elementos
	  if( elemento !== undefined ){  
		  //verificamos cual es la longitud. length es una propiedad de un arreglo, 
		  //si el elemento no es un arreglo (dos o mas elementos),length valdra undefined por lo que consideraremos 
		  //que no es un arreglo (solo un valor)
		  dimension = elemento.length;
		  if(dimension === undefined){
			dimension=1;//como es undefined determinamos que la longitud es uno
		  }
	  }
	  return dimension; //regresamos cero zonas
}



//-------------------------------------------------------------------------------------------------------------------------------------------
//Esta funcion la ocupamos para convertir el atributo (variable) de un objeto en un arreglo de una dimension .
//Esto lo hacemos porque en ocaciones requerimos que independientemente de de la estructura inicial de un atributo 
//de un objeto sea una variable o un arreglo, se puede manejar como un arreglo de 1 o mas elementos
//definicion:
//    fixSimpleObjectToArrayObject( parent_object_like_reference, target_child_object_like_string)
function fixSimpleObjectToArrayObject(_parent_object,_child_object_name){
	
	var c_object = _parent_object[_child_object_name];
	var num_objects = elementoLength(c_object);
	 
	 if(num_objects ==1){	 
		var c_object_aux = c_object;
		_parent_object[_child_object_name] = [c_object_aux];
	}
}

//------------------------------------------------------------------------------------------------------
//en esta estructura xml, existen elementos que deberian ser arreglos, pero cuando es uno solo de ellos al convertirlos  
//lo hacen como objetos simples por lo que su acceso cambia. con esta funcion esos objetos simples los volvemos arreglos de un elemento.
/*function fixEstructuraXML(xml_obj){
	
	 var  num_zonas = elementoLength(xml_obj.zonas.zona);
	  
	 // alert("2:zona_id"+xml_obj.zonas.zona[0].zona_id);
	  //una zona
	 if(num_zonas ==1){
			//convertimos el objeto "medicion" en arreglo para poder recorrerlo de manera similiar
			var obj_zona = xml_obj.zonas.zona;
			//xml_obj.zonas.zona = new Array(obj_zona);
			xml_obj.zonas.zona = [obj_zona];
			
	  }
	  
	for(var i=0 ; i<xml_obj.zonas.zona.length; i++){
		var num_mediciones = elementoLength(xml_obj.zonas.zona[i].mediciones.medicion);
		
		if(num_mediciones ==1){ 
		    //convertimos el objeto "medicion" en arreglo para poder recorrerlo de manera similiar
			var obj_medicion = xml_obj.zonas.zona[i].mediciones.medicion;
			xml_obj.zonas.zona[i].mediciones.medicion =[obj_medicion];
			
		 }
		
	}
	
}*/







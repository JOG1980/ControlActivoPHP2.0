<?php

	session_start();

	$funcion = $_GET['funcion'];
	$datos = json_decode($_GET['datos']); //Takes a JSON encoded string and converts it into a PHP variable.
/*
function saveHelpStatus($xml_archivo_conf){}
    $xml_archivo = simplexml_load_file($xml_archivo_conf);
    
    $medicion = $xml_archivo->zonas->zona[$indice_zona]->mediciones->medicion[$indice_medicion];
    
    $medicion->se = $se;
   
    
    $xml_archivo->saveXML("config.xml");
  }


*/
  $myObj = (object)[]; // Cast empty array to object
  $myObj->funcion = $funcion;

  if($funcion === 'guardarEstadoActivarAyudaEnXML'){
  	


  	$xml_archivo = simplexml_load_file('config.xml');
		
		
		$xml_archivo->perfiles->usuarios->usuario[3]->help = $datos->help_enabled;
		 
		$xml_archivo->saveXML("config.xml");

		$myObj->help_enabled = $datos->help_enabled;


  }
  else{

  }


//codificacion de datos de obj a json
$myJSON = json_encode($myObj);

echo $myJSON;


?>
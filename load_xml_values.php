<?php

//cargamos archivo de configuracion --------------------------------------------------------------------------------------------
$nombre_archivo_configuracion_xml = "config.xml";

$titulo            = "";

//obtener datos base de datos ----------------------------------------
/*$database_host     = "";
$database_name     = "";
$database_username = "";
$database_password = "";*/

//obtener datos cuenta login -----------------------------------------
$nickname = "";
$help_enabled =  "";



//cargamos el archivo xml --------------------------------------------
$xml_archivo = "";
if ( file_exists($nombre_archivo_configuracion_xml) ) {	
	//carga del archivo de configura
	$xml_archivo = simplexml_load_file($nombre_archivo_configuracion_xml);
}
else {
	$_SESSION["MSG_ERROR"] ="No existe el archivo de configuracion: ".$nombre_archivo_configuracion_xml;
}

		

//obtener datos generales --------------------------------------------
$titulo = $xml_archivo->general->titulo;

//obtener datos base de datos ----------------------------------------
/*$database_host     = $xml_archivo->database->host;
$database_name     = $xml_archivo->database->db_name;
$database_username = $xml_archivo->database->username;
$database_password = $xml_archivo->database->password;*/


//validamos las variables emviadas por post de usuario y password			
if( isset($_SESSION['IP_CLIENT']) && !empty( $_SESSION['IP_CLIENT'] )) {

	$c_ip_client = $_SESSION['IP_CLIENT'];

	//revision de las direcciones ip del archivo de configuracion con la direccion obtenida de la session
	foreach ($xml_archivo->perfiles->direcciones_ip->direccion_ip as $direccion_ip) {
				
		$c_ip_xml    = (string)$direccion_ip->ip; 				//obtenemos la direccion del elemento actual del xml
		$c_help_xml = (string)$direccion_ip->help_enabled; 					//obtenemos el estado actual de la ayuda del xml
		
		//comparamos las ip, para
		if( $c_ip_client == $c_ip_xml ){
			$help_enabled = $c_help_xml;  //help del XML
			break;
		}
	}

	
}
//validamos las variables emviadas por post de usuario y password			
else if( isset($_SESSION["USERNAME"]) && !empty($_SESSION["USERNAME"]) &&
		isset($_SESSION["PASSWORD"]) && !empty($_SESSION["PASSWORD"]) ) {
			
	$c_username = $_SESSION['USERNAME'];
	$c_password = $_SESSION['PASSWORD'];
			
	//validamos los perfiles de usuario del xml -------------------------------------------
	foreach ($xml_archivo->perfiles->usuarios->usuario as $usuario) {
	
		//usduario y password actuales del xml
		$c_usuario_xml = (string)$usuario->username;
		$c_password_xml = (string)$usuario->password;

		$c_help_xml = (string)$usuario->help_enabled; 	

		//validacion de usuario y password de las variables post con los guardados en el xml		
		if(  strcasecmp ( $c_username , $c_usuario_xml ) ==0 && strcasecmp ( $c_password , $c_password_xml ) ==0){
									
			$help_enabled = $c_help_xml;  //help del XML
			break;
		}
		
	}
}




?>
<?php

/*
NOTA: Este php valida los datos de logueo por ip o por usuario y password, la validacion se registra en 
      la variable se session $_SESSION["LOGIN_OK"]
*/

//PINTAR VARIABLES-para pruebas-----------------------------------------
//echo "REMOTE_ADDR: ".$_SERVER['REMOTE_ADDR']."<br />";
//echo "REQUEST_URI: ".$_SERVER['REQUEST_URI']."<br />";
//echo "PHP_SELF: ".$_SERVER['PHP_SELF']."<br />";

//$arreglo_php_self = explode('/', $_SERVER['PHP_SELF']);
//$pagina_actual = array_pop($arreglo_php_self);
//echo "PHP Actual: ".array_pop($arreglo_php_self)."<br />";
//echo "PHP Actual: ". basename($_SERVER['PHP_SELF'])."<br />";*/


//esta variable la ocupamos para validar por ip o por usuario y password
$login_status = false;


//Realizar conexion a base de datos -----------------------------------------------------------------------
//las variables de conexion estan en el archivo conection_db.php
$connect_db = new mysqli($dbHost,  $dbUsername, $dbPassword, $dbName );
  
if($connect_db->connect_error){
     die("Cannot connect to data base: \n". $connect_db->connect_error . "\n". $connect_db->connect_errno );
}

//traer todos los registros del activo ------------------------------------------------------------------------
$sql = "SELECT * FROM a_acceso";
  
$results = $connect_db->query($sql);
$records = [];
if($results->num_rows > 0){
    while( $row = $results->fetch_object() ){
        $records[] = $row;
    }//end while
}//end if



//|| !$_SESSION["LOGIN_OK"] hay que validar si es necesario
//---------------------------------------------------------------------------------------------------------------------------------
//si no existen las variables de session, esta vacia o tiene el valor de falso
if( !isset($_SESSION["LOGIN_OK"]) || empty($_SESSION["LOGIN_OK"])  ){
		
	//-- Validamos por ip ---------------------------------------------------------------------------------------------------------		
	$ip_cliente = $_SERVER['REMOTE_ADDR'];	//obtiene la ip remota almacenada en la variable del server automaticamente
	$c_username = "";
	$c_password = "";

	//validamos las variables emviadas por post de usuario y password ----------------------			
	if( isset($_POST["USERNAME"]) && !empty($_POST["USERNAME"]) &&
		isset($_POST["PASSWORD"]) && !empty($_POST["PASSWORD"]) ) {
			
		$c_username = $_POST['USERNAME'];
		$c_password = $_POST['PASSWORD'];
	}

	//revision de las direcciones ip del archivo de configuracion con la direccion obtenida de la session
	$num_registros = count($records);

	//recorre todos los rgistros de la base de datos -----------------------------------------
	for($i =0 ; $i < $num_registros ; $i++){

		$acceso_id         = $records[$i]->acceso_id;
		$username          = $records[$i]->username;
		$password          = $records[$i]->password;
		$ip                = $records[$i]->ip;
		$acceso_ip         = $records[$i]->acceso_ip;
		$nombre            = $records[$i]->nombre;
		$descripcion       = $records[$i]->descripcion;
		$registro_editable = $records[$i]->registro_editable;
		$ayuda             = $records[$i]->ayuda;
		$rol_id            = $records[$i]->rol_id;

		//validamos por ip -----------------------------------------------
		if( $ip == $ip_cliente  && $acceso_ip =='1' ){

			$_SESSION["LOGIN_OK"]  = true;			  //login correcto
			$_SESSION["ACCESS_ID"] = $acceso_id; 
			$_SESSION["NOMBRE"]    = $nombre;  
			$_SESSION["ROL_ID"]    = $rol_id;		
			$login_status = true;
			break;
		}
		//validamos por usuario y password -----------------------------------------------
		else if( $username == $c_username && $password == $c_password){

			$_SESSION["LOGIN_OK"]  = true;			  //login correcto
			$_SESSION["ACCESS_ID"] = $acceso_id; 
			$_SESSION["NOMBRE"]    = $nombre;  
			$_SESSION["ROL_ID"]    = $rol_id;		
			$login_status = true;
			break;
		}

	}//end for	
			
}//end if

//verificacion de sio se pudo relizar el logueo
if(!$login_status){
	$_SESSION["MSG_ERROR"] ="Username o Password incorrectos.";
}	


?>
	
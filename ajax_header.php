<?php

  session_start();

  $funcion = $_GET['funcion'];
  $datos = json_decode($_GET['datos']); //Takes a JSON encoded string and converts it into a PHP variable.

  $myObj = (object)[]; // Cast empty array to object
  $myObj->funcion = $funcion;

  // <-- BASE DE DATOS ----------------------------------------------------------------------------------------------->
  //contiene las variables que corresponden a la configuracion
  require_once 'config.php'; 

  if($funcion === 'guardarEstadoActivarAyuda'){
  
    //obtenemos valores del aceso -----------------------------------
    if( isset($_SESSION["ACCESS_ID"]) ){
       
       $sql = "UPDATE a_acceso SET ayuda='" . $datos->help_enabled . "' WHERE acceso_id='" . $_SESSION["ACCESS_ID"] . "'";

        //Realizar conexion a base de datos -----------------------------------------------------------------------
        //las variables de conexion estan en el archivo conection_db.php
        $connect_db = new mysqli($dbHost,  $dbUsername, $dbPassword, $dbName );
          
        if($connect_db->connect_error){
           die("Cannot connect to data base: \n". $connect_db->connect_error . "\n". $connect_db->connect_errno );
        }
    
        if ($connect_db->query($sql) === TRUE) {
            $myObj->estado_proceso = "OK";
            $myObj->msn = "New record updated successfully";
            $myObj->help_enabled = $datos->help_enabled;
        } else {
            $myObj->estado_proceso = "ERROR";
            $myObj->msn = "Error: " . $connect_db->error;
        }

        $connect_db->close();
    
    }//end if
  }//end if funcion

//codificacion de datos de obj a json
$myJSON = json_encode($myObj);

echo $myJSON;


?>

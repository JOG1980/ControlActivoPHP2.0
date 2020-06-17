<?php
  session_start();

 
  // <-- BASE DE DATOS ----------------------------------------------------------------------------------------------->
  //contiene las variables que corresponden a la configuracion
  require_once 'config.php'; 

  //variable para capturar el rol de la variable de session
   $rol = '';
   $habilitar_queries = false;

  //inicializacion de variables
  $funcion = "";
  $datos   = "";
 

  //obtenemos valores del rol -----------------------------------
  if( isset($_SESSION["ROL_ID"]) ) { //validamos que el rol dea de admin
   $rol = $_SESSION["ROL_ID"];
  }
  if( $rol=='1' || $rol=='2' ){
    $habilitar_queries = true;
  }



  $funcion = $_POST['funcion'];

  if( isset($_POST['datos']) && !empty($_POST['datos'])  ){
      
      $datos = json_decode($_POST['datos']); //Takes a JSON encoded string and converts it into a PHP variable.
  }

  //variable objeto para responce del ajax--------------
  $myObj = (object)[]; // Cast empty array to object
  $myObj->funcion = $funcion;

  
  //Realizar conexion a base de datos -----------------------------------------------------------------------
  //las variables de conexion estan en el archivo conection_db.php
  $connect_db = new mysqli($dbHost,  $dbUsername, $dbPassword, $dbName );

  if($connect_db->connect_error){
      die("Cannot connect to data base: \n". $connect_db->connect_error . "\n". $connect_db->connect_errno );
  }

  
  //funcion de todos los registros registro ---------------------------------------------------
  if($funcion === 'buscar_registros'){

      $id          = $datos->id;
      $nombre      = $datos->nombre;
      $descripcion = $datos->descripcion;
      $grupo_id  = $datos->grupo_id;
      $estado_registro_id = $datos->estado_registro_id;
      $fecha_registro_inicial = $datos->fecha_registro_inicial;
      $fecha_registro_final   = $datos->fecha_registro_final;
   
      //$sql = "SELECT * FROM c_subgrupo";
      $sql = "SELECT c_subgrupo.*, c_grupo.nombre as grupo_nombre, c_estado_registro.nombre as estado_registro_nombre 
      FROM c_subgrupo 
      LEFT JOIN c_grupo ON c_subgrupo.grupo_id = c_grupo.grupo_id
      LEFT JOIN c_estado_registro ON c_subgrupo.estado_registro_id = c_estado_registro.estado_registro_id WHERE 1 ";

    
      if($id != NULL && $id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND subgrupo_id='".$id."' ";
      }

      if($nombre != NULL && $nombre != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_subgrupo.nombre LIKE '%".$nombre."%' ";
      }

      if($descripcion != NULL && $descripcion != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_subgrupo.descripcion LIKE '%".$descripcion."%' ";
      }

      if($grupo_id != NULL && $grupo_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_subgrupo.grupo_id = '".$grupo_id."' ";
      }

     if($estado_registro_id != NULL && $estado_registro_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_subgrupo.estado_registro_id = '".$estado_registro_id."' ";
      }

      if( ($fecha_registro_inicial != NULL && $fecha_registro_inicial!="") &&
          ($fecha_registro_final != NULL && $fecha_registro_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  c_subgrupo.fecha_registro BETWEEN '".$fecha_registro_inicial." 00:00:00' AND '".$fecha_registro_final." 23:59:59' ";
      }

      $results = $connect_db->query($sql);
      if ($results!=NULL) {
          $records = [];
          if($results->num_rows > 0){
            while( $row = $results->fetch_object() ){
              $records[] = $row;
            }

          }
          
          $myObj->records = $records;
          $myObj->estado_proceso = "OK";
          $myObj->msn = "Select Proccess Successfully";
      }
      else {
          $myObj->estado_proceso = "ERROR";
          $myObj->msn = "Error: " . $connect_db->error;
      }

  }
  
  //funcion de nuevo registro ---------------------------------------------------
  else if($funcion === 'nuevo_registro' && $habilitar_queries == true){

      $nombre      = $datos->nombre;
      $descripcion = $datos->descripcion;
      $grupo_id = $datos->grupo_id;
      $estado_registro_id = $datos->estado_registro_id;
      
     
      $sql = "INSERT INTO c_subgrupo (nombre,descripcion,fecha_registro,grupo_id,estado_registro_id) 
              VALUES ('".$nombre."', '".$descripcion."','" . date("Y-m.d H:i:s") . "','".$grupo_id."','".$estado_registro_id."')";

      if ($connect_db->query($sql) === TRUE) {
          $myObj->estado_proceso = "OK";   
          $myObj->msg = "New record created successfully";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;  
      } 
      else{
          $myObj->estado_proceso = "ERROR";   
          $myObj->msg = "";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;  

      }
      //$myObj->sql = $sql;
  }//end if nuevo registro

   //funcion de editar registro ---------------------------------------------------
  else if($funcion === 'editar_registro' && $habilitar_queries == true){
    
      $id          = $datos->id;
      $nombre      = $datos->nombre;
      $descripcion = $datos->descripcion;
      $estado_registro_id = $datos->estado_registro_id;
      $grupo_id = $datos->grupo_id;

      //$sql = "UPDATE c_subgrupo SET fecha_registro = '".  date("Y-m.d H:i:s") ."', nombre = '" . $nombre . "', descripcion = '" . $descripcion . "', estado_registro_id = '". $estado_registro_id ."' WHERE subgrupo_id='" . $id. "'";
     $sql = "UPDATE c_subgrupo SET nombre = '".$nombre."', descripcion='". $descripcion."', grupo_id='".$grupo_id."', estado_registro_id='".$estado_registro_id."' WHERE subgrupo_id='".$id."'";
     
      if ($connect_db->query($sql) === TRUE) {
          $myObj->id = $id;
          $myObj->estado_proceso = "OK";   
          $myObj->msg = "New record created successfully";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;  
      } else {
           $myObj->id = $id;
          $myObj->estado_proceso = "ERROR";   
          $myObj->msg = "";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;   
      }
      
  }//end if

  //funcion de borrar registro ---------------------------------------------------
  else if($funcion === 'borrar_registro' && $habilitar_queries == true){

    $lista_ids = $datos->lista_ids;

    $myObj->id = array();
    $myObj->estado_proceso = array();
    $myObj->error_codes = array();
    $myObj->error_msg = array();
    $myObj->msg = array();

    for($i =0; $i < count($lista_ids) ; $i++){
        
        $sql = "DELETE FROM c_subgrupo WHERE subgrupo_id ='" . $lista_ids[ $i ] . "'";

        if ($connect_db->query($sql) === TRUE) {
            array_push($myObj->id, $lista_ids[ $i ] );
            array_push($myObj->estado_proceso, "OK" );   
            array_push( $myObj->msg,"Record Delete successfully");
            array_push( $myObj->error_codes,$connect_db->errno);
            array_push( $myObj->error_msg,$connect_db->error);
        } 
        else {
            array_push($myObj->id, $lista_ids[ $i ] );
            array_push($myObj->estado_proceso, "ERROR" );   
            array_push( $myObj->msg,"");
            array_push( $myObj->error_codes,$connect_db->errno);
            array_push( $myObj->error_msg,$connect_db->error);
        }
    }//end for
  }//end else if borrar registro


$connect_db->close();
//codificacion de datos de obj a json
$myJSON = json_encode($myObj);

echo $myJSON;


?>

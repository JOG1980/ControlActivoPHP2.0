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

      $id      = $datos->id;
      $nombres = $datos->nombres;
      $apellido_paterno = $datos->apellido_paterno;
      $apellido_materno = $datos->apellido_materno;
      $rpe = $datos->rpe;
      $email = $datos->email;
      $habilitado = $datos->habilitado;
      $estado_registro_id = $datos->estado_registro_id;
      $fecha_registro_inicial = $datos->fecha_registro_inicial;
      $fecha_registro_final   = $datos->fecha_registro_final;
   
     
      //$sql = "SELECT * FROM c_usuario";
      $sql = "SELECT c_usuario.*, c_estado_registro.nombre as estado_registro_nombre FROM c_usuario 
      LEFT JOIN c_estado_registro ON c_usuario.estado_registro_id = c_estado_registro.estado_registro_id WHERE 1 ";

      if($id != NULL && $id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND usuario_id='".$id."' ";
      }

      if($rpe != NULL && $rpe != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.rpe LIKE '%".$rpe."%' ";
      }


      if($nombres != NULL && $nombres != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.nombres LIKE '%".$nombres."%' ";
      }

      if($apellido_paterno != NULL && $apellido_paterno != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.apellido_paterno LIKE '%".$apellido_paterno."%' ";
      }

      if($apellido_materno != NULL && $apellido_materno != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.apellido_materno LIKE '%".$apellido_materno."%' ";
      }

    if($email != NULL && $email != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.email LIKE '%".$email."%' ";
      }

      if($habilitado != NULL && $habilitado != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         //$sql = $sql . " AND c_usuario.habilitado LIKE '%".$habilitado."%' ";
         $sql = $sql . " AND c_usuario.habilitado =".$habilitado." ";
      }

     if($estado_registro_id != NULL && $estado_registro_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND c_usuario.estado_registro_id = '".$estado_registro_id."' ";
      }

      if( ($fecha_registro_inicial != NULL && $fecha_registro_inicial!="") &&
          ($fecha_registro_final != NULL && $fecha_registro_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  c_usuario.fecha_registro BETWEEN '".$fecha_registro_inicial." 00:00:00' AND '".$fecha_registro_final." 23:59:59' ";
      }
$myObj->sql = $sql;
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

      $nombres = $datos->nombres;
      $apellido_paterno = $datos->apellido_paterno;
      $apellido_materno = $datos->apellido_materno;
      $rpe = $datos->rpe;
      $email = $datos->email;
      $habilitado = $datos->habilitado;
      $estado_registro_id = $datos->estado_registro_id;

     
    
      $sql = "INSERT INTO c_usuario (nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, fecha_registro, estado_registro_id) 
              VALUES ('".$nombres."','".$apellido_paterno."','".$apellido_materno."','".$rpe."', '".$email."', '".$habilitado."','" . date("Y-m.d H:i:s") . "','".$estado_registro_id."')";
      if ($connect_db->query($sql) === TRUE) {
          $myObj->estado_proceso = "OK";   
            $myObj->msg = "New record created successfully";
            $myObj->error_codes = $connect_db->errno;
            $myObj->error_msg = $connect_db->error;
      } else {
          $myObj->estado_proceso = "ERROR";   
            $myObj->msg = "";
            $myObj->error_codes = $connect_db->errno;
            $myObj->error_msg = $connect_db->error;
      }
      //$myObj->sql = $sql;
  }

   //funcion de editar registro ---------------------------------------------------
  else if($funcion === 'editar_registro' && $habilitar_queries == true){

    $id      = $datos->id;
    $nombres = $datos->nombres;
    $apellido_paterno = $datos->apellido_paterno;
    $apellido_materno = $datos->apellido_materno;
    $rpe = $datos->rpe;
    $email = $datos->email;
    $habilitado = $datos->habilitado;
    $estado_registro_id = $datos->estado_registro_id;
    
    /*$sql = "UPDATE c_usuario SET nombres='".$nombres .
                 "',fecha_registro='".date("Y-m.d H:i:s").
                 "',apellido_paterno='".$apellido_paterno.
                 "',apellido_materno='".$apellido_materno.
                 "', rpe='".$rpe.
                 "', email='".$email.
                 "', habilitado='".$habilitado.
                 "', estado_registro_id = '". $estado_registro_id .
                 "' WHERE usuario_id='".$id."'";*/
      $sql = "UPDATE c_usuario SET nombres='".$nombres .
                 "',apellido_paterno='".$apellido_paterno.
                 "',apellido_materno='".$apellido_materno.
                 "', rpe='".$rpe.
                 "', email='".$email.
                 "', habilitado='".$habilitado.
                 "', estado_registro_id = '". $estado_registro_id .
                 "' WHERE usuario_id='".$id."'";
     
      if ($connect_db->query($sql) === TRUE) {
           $myObj->id = $id;
          $myObj->estado_proceso = "OK";   
          $myObj->msg = "New record created successfully";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;  
      } 
      else {
          $myObj->id = $id;
          $myObj->estado_proceso = "ERROR";   
          $myObj->msg = "";
          $myObj->error_codes = $connect_db->errno;
          $myObj->error_msg = $connect_db->error;  
      }
      
  }

  //funcion de borrar registro ---------------------------------------------------
  else if($funcion === 'borrar_registro' && $habilitar_queries == true){

    $lista_ids = $datos->lista_ids;

    $myObj->id = array();
    $myObj->estado_proceso = array();
    $myObj->error_codes = array();
    $myObj->error_msg = array();
    $myObj->msg = array();

    for($i =0; $i < count($lista_ids) ; $i++){
        
        $sql = "DELETE FROM c_usuario WHERE usuario_id ='" . $lista_ids[ $i ] . "'";

        if ($connect_db->query($sql) === TRUE) {

            array_push($myObj->id, $lista_ids[ $i ] );
            array_push($myObj->estado_proceso, "OK" );   
            array_push( $myObj->msg,"Record Delete successfully");
            array_push( $myObj->error_codes,$connect_db->errno);
            array_push( $myObj->error_msg,$connect_db->error);
        } else {
            array_push($myObj->id, $lista_ids[ $i ] );
            array_push($myObj->estado_proceso, "ERROR" );   
            array_push( $myObj->msg,"");
            array_push( $myObj->error_codes,$connect_db->errno);
            array_push( $myObj->error_msg,$connect_db->error);
        }


      
    }

    //$myObj->sql = $sql;
  }


$connect_db->close();
//codificacion de datos de obj a json
$myJSON = json_encode($myObj);

echo $myJSON;


?>

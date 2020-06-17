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
      $descripcion = $datos->descripcion;
      $tipo_activo_id = $datos->tipo_activo_id;
      $marca  = $datos->marca;
      $modelo = $datos->modelo;
      $numero_serie  = $datos->numero_serie;
      $numero_activo = $datos->numero_activo;
      $numero_inventario = $datos->numero_inventario;
      $centro_trabajo_id = $datos->centro_trabajo_id;
      $ubicacion_id = $datos->ubicacion_id;
      $usuario_id = $datos->usuario_id;
      $en_uso = $datos->en_uso;
      $en_activo_oficial = $datos->en_activo_oficial;
      $en_prestamo = $datos->en_prestamo;
      $fecha_registro_inicial = $datos->fecha_registro_inicial;
      $fecha_registro_final   = $datos->fecha_registro_final;
      $fecha_ingreso_inicial = $datos->fecha_ingreso_inicial;
      $fecha_ingreso_final   = $datos->fecha_ingreso_final;
      $fecha_alta_inicial = $datos->fecha_alta_inicial;
      $fecha_alta_final   = $datos->fecha_alta_final;
      $fecha_baja_inicial = $datos->fecha_baja_inicial;
      $fecha_baja_final   = $datos->fecha_baja_final;
      $estado_registro_id = $datos->estado_registro_id;
      

       $sql = "SELECT a_activo.*
            ,c_tipo_activo.nombre as tipo_activo_nombre
            ,c_centro_trabajo.nombre as centro_trabajo_nombre
            ,c_ubicacion.nombre as ubicacion_nombre
            ,c_usuario.rpe as usuario_rpe
            ,c_usuario.nombres as usuario_nombres
            ,c_usuario.apellido_paterno as usuario_apellido_paterno
            ,c_usuario.apellido_materno as usuario_apellido_materno
            ,c_estado_registro.nombre as estado_registro_nombre
        FROM a_activo 
        LEFT JOIN c_tipo_activo ON a_activo.tipo_activo_id = c_tipo_activo.tipo_activo_id 
        LEFT JOIN c_centro_trabajo ON a_activo.centro_trabajo_id = c_centro_trabajo.centro_trabajo_id 
        LEFT JOIN c_ubicacion ON a_activo.ubicacion_id = c_ubicacion.ubicacion_id 
        LEFT JOIN c_usuario ON a_activo.usuario_id = c_usuario.usuario_id 
        LEFT JOIN c_estado_registro ON a_activo.estado_registro_id = c_estado_registro.estado_registro_id WHERE 1 ";
    

      //$sql = "SELECT * FROM a_activo";
      /*$sql = "SELECT a_activo.*, c_estado_registro.nombre as estado_registro_nombre FROM a_activo 
      LEFT JOIN c_estado_registro ON a_activo.estado_registro_id = c_estado_registro.estado_registro_id WHERE 1 ";*/

    
      if($id != NULL && $id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND activo_id='".$id."' ";
      }

      if($descripcion != NULL && $descripcion != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.descripcion LIKE '%".$descripcion."%' ";
      }

      if($tipo_activo_id != NULL && $tipo_activo_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.tipo_activo_id='".$tipo_activo_id."' ";
      }

      if($marca != NULL && $marca != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND marca LIKE '%".$marca."%' ";
      }

      if($modelo != NULL && $modelo != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND modelo LIKE '%".$modelo."%' ";
      }

      if($numero_serie != NULL && $numero_serie != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND numero_serie LIKE '%".$numero_serie."%' ";
      }

      if($numero_activo != NULL && $numero_activo != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND numero_activo LIKE '%".$numero_activo."%' ";
      }

      if($numero_inventario != NULL && $numero_inventario != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND numero_inventario LIKE '%".$numero_inventario."%' ";
      }

      if($centro_trabajo_id != NULL && $centro_trabajo_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.centro_trabajo_id='".$centro_trabajo_id."' ";
      }

      if($ubicacion_id != NULL && $ubicacion_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.ubicacion_id='".$ubicacion_id."' ";
      }

      if($usuario_id != NULL && $usuario_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.usuario_id='".$usuario_id."' ";
      }

      if($en_uso != NULL && $en_uso != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND en_uso=".$en_uso." ";
      }

      if($en_activo_oficial != NULL && $en_activo_oficial != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND en_activo_oficial=".$en_activo_oficial." ";
      }

      if($en_prestamo != NULL && $enen_prestamo != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND en_prestamo=".$en_prestamo." ";
      }
     
      if( ($fecha_registro_inicial != NULL && $fecha_registro_inicial!="") &&
          ($fecha_registro_final != NULL && $fecha_registro_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  a_activo.fecha_registro BETWEEN '".$fecha_registro_inicial." 00:00:00' AND '".$fecha_registro_final." 23:59:59' ";
      }

      if( ($fecha_ingreso_inicial != NULL && $fecha_ingreso_inicial!="") &&
          ($fecha_ingreso_final != NULL && $fecha_ingreso_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  fecha_ingreso BETWEEN '".$fecha_ingreso_inicial." 00:00:00' AND '".$fecha_ingreso_final." 23:59:59' ";
      }

      if( ($fecha_alta_inicial != NULL && $fecha_alta_inicial!="") &&
          ($fecha_alta_final != NULL && $fecha_alta_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  fecha_alta BETWEEN '".$fecha_alta_inicial." 00:00:00' AND '".$fecha_alta_final." 23:59:59' ";
      }

      if( ($fecha_baja_inicial != NULL && $fecha_baja_inicial!="") &&
          ($fecha_baja_final != NULL && $fecha_baja_final!="")) { //se valida diferente de vacio, ya que es un campo que no puede ser nulo
             $sql = $sql . " AND  fecha_baja BETWEEN '".$fecha_baja_inicial." 00:00:00' AND '".$fecha_baja_final." 23:59:59' ";
      }

      if($estado_registro_id != NULL && $estado_registro_id != ""){ //se valida diferente de vacio, ya que es un campo que no puede ser nulo
         $sql = $sql . " AND a_activo.estado_registro_id = '".$estado_registro_id."' ";
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
      $myObj->sql = $sql;
  }
  
  //funcion de nuevo registro ---------------------------------------------------
  else if($funcion === 'nuevo_registro' && $habilitar_queries == true){

      $nombre      = $datos->nombre;
      $descripcion = $datos->descripcion;
      $estado_registro_id = $datos->estado_registro_id;
     
      $sql = "INSERT INTO a_activo (nombre,descripcion,fecha_registro,estado_registro_id) 
              VALUES ('".$nombre."', '".$descripcion."','" . date("Y-m.d H:i:s") . "','".$estado_registro_id."')";

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

      //$sql = "UPDATE a_activo SET fecha_registro = '".  date("Y-m.d H:i:s") ."', nombre = '" . $nombre . "', descripcion = '" . $descripcion . "', estado_registro_id = '". $estado_registro_id ."' WHERE tipo_activo_id='" . $id. "'";
       $sql = "UPDATE a_activo SET nombre = '" . $nombre . "', descripcion = '" . $descripcion . "', estado_registro_id = '". $estado_registro_id ."' WHERE tipo_activo_id='" . $id. "'";
     
     
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
        
        $sql = "DELETE FROM a_activo WHERE tipo_activo_id ='" . $lista_ids[ $i ] . "'";

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
    }//end for
  }//end else if borrar registro


$connect_db->close();
//codificacion de datos de obj a json
$myJSON = json_encode($myObj);

echo $myJSON;


?>

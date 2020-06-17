<?php 

 	//session_name();
	session_start();

	//activar busqueda inicial. al mostrarce la pagina por primera ves hace una busqueda total de registros
	$activar_busqueda_inicial = true;

	//activar funciones de duplicar en cascada y duplicar-actualizar
	$activar_funcion_duplicar = true;
	
	// <-- ACCESO ----------------------------------------------------------------------------------------------->
	//si el login es correcto direcciona a la pagina de activo
	if( !isset($_SESSION["LOGIN_OK"]) || !$_SESSION["LOGIN_OK"] ){
		session_destroy();
		header('Location: login.php' );
		
	}


	// <-- BASE DE DATOS Y VARIABLES GLOBALES ----------------------------------------------------------------------------------------------->
	//contiene las variables que corresponden a la configuracion
	require_once 'config.php'; 

	//definicion de variable de rol
	$rol = ROL_INVITADO; //1.administrador, 2.superusuario 3.usuario 4.invitado
	$enable_component = "";

  //Realizar conexion a base de datos -----------------------------------------------------------------------
  //las variables de conexion estan en el archivo conection_db.php
  $connect_db = new mysqli($dbHost,  $dbUsername, $dbPassword, $dbName );
   
  if($connect_db->connect_error){
      die("Cannot connect to data base: \n". $connect_db->connect_error . "\n". $connect_db->connect_errno );
  }

  //traer todos los registros del estado registro ------------------------------------------------------------------------
  $sql = "SELECT * FROM c_estado_registro";
  
  $results = $connect_db->query( $sql );
  $records = [];
  if($results->num_rows > 0){
    while( $row = $results->fetch_object() ){
      $records[] = $row;
    }
  }

 //obtenemos valores del rol -----------------------------------
  //los valoresa de rol pueden ser
  //1. admin   2. superusuario  3.usuario  4. invitado
if( isset($_SESSION["ROL_ID"]) ) { //validamos que el rol dea de admin
   $rol = intval($_SESSION["ROL_ID"]);
}

//habilitamops el enable para los botones segun el segun el perfil
if($rol!=ROL_ADMIN && $rol!=ROL_SUPERUSUARIO ){
	$enable_component = "disabled";
} 

?>

<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="cache-control" content="max-age=0" />
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<meta http-equiv="pragma" content="no-cache" />
	<meta charset="UTF-8">
	<title>CONTROL DE ACTIVO v2.00</title>

	<link rel="icon" href="images/control_activo_icono.jpg"> <!-- icono de la pagina -->
<!--=================================================================================================================================-->
	<link rel="stylesheet" type="text/css" href="bootstrap-4.4.1/css/bootstrap.min.css"> <!-- Bootstrap v4.x stylesheet -->
	<link rel="stylesheet" type="text/css" href="font-awesome-4.7.0/css/font-awesome.min.css">
	
	<link rel="stylesheet" type="text/css" href="tablesorter_v2.31.3/css/theme.bootstrap_4.css">
	<link rel="stylesheet" type="text/css" href="tablesorter_v2.31.3/pager/jquery.tablesorter.pager.css">

	<!--jquery-ui-->
	<link rel="stylesheet" type="text/css" href="jquery-ui-1.12.1/jquery-ui.min.css">
	

	<link rel="stylesheet" type="text/css" href="css/base.css">

	<link rel="stylesheet" type="text/css" href="css/loader.css"> <!---LOADER-->

<!--================================================================================================================================-->
	
</head>
<body>
	
	<!--===============================================================================================================-->
	<!--LOADER -->
	<div id="loader_master_container">
  		<div id="loader_background"></div>
  		<div id="loader_container">
    		<div id="loader_animation"></div>
    		<div id="loader_text">Cargando ....</div>
  		</div>
	</div>
	<!--===============================================================================================================-->
	

	<!--este input hidden almacena el rol guardado desde el php-->
	<input type="hidden" id="hd_rol_id" name="hd_rol" <?php echo 'value="'.$rol.'"';?> />
	<!--este input hidden define si se muestran las opciones de duplicar-->
	<input type="hidden" id="hd_activar_funcion_duplicar"  <?php echo 'value="'.$activar_funcion_duplicar.'"';?> />

	<div class="limiter">
		<!-- HEADER LAYOUT ------------------------------------------------------------------------------------------>

		<?php include("header.php"); ?>

		<!-- BODY LAYOUT   ------------------------------------------------------------------------------------------>

		<div class="container-login100">
			
			<div class="wrap-login100">
				
				<!-- titulo de la tabla ------------>
				<div class="container-fluid">
				  <div class="row">
				    <div class="col-sm-4">
				       <div class="my_titulo"><h1>Catálogo de Estado de Registros</h1></div>
				    </div>
				    <div class="col-sm" style="text-align: right;">
				    	
				      	<!-- bton de buscar en la base de datos-->
				      	<button type="button" class="btn my_btn btn-light"  id="btn_buscar_base_datos" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/table_tab_search.png" /></button>

				      	<!-- bton de buscar todo  en la base de datos-->
				      	<button type="button" class="btn my_btn btn-light"  id="btn_buscar_base_datos_todos" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/google_custom_search.png" /></button>

				    </div>
				    <div class="col-sm-2" style="text-align: right;">
				  
				      	<!-- borrar filtros -->
				      	<!--<button type="button" class="btn my_btn btn-light btn_limpiar_filtros reset" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/draw_eraser.png" /></button>-->

				      	<button type="button" class="btn my_btn btn-light btn_mostrar_tabla_default" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/table_refresh.png" /></button>

				      	<button type="button" class="btn my_btn btn-light btn_mostrar_todos_campos" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/table_columns_insert_right.png" /></button>

				      	<button type="button" class="btn my_btn btn-light btn_mostrar_campos_seleccionados" data-container="body" data-toggle="popover" title=""data-placement="left" data-content="" style="display:none;">
				      		<img src="images/icons/32x32/table_columns_insert_left.png" />
				      	</button>

				      	<button type="button" class="btn my_btn btn-light btn_seleccionar_campos_para_mostrar" data-container="body" data-toggle="popover" title="" data-placement="left" data-content=""><img src="images/icons/32x32/table_gear.png" /></button>

				     </div>
				     <div class="col-sm-1" style="text-align: right;">
				      	<button type="button" class="btn my_btn btn-light" id="btn_mostrar_modal_nuevo_registro" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" <?php if($rol!=ROL_ADMIN && $rol!=ROL_SUPERUSUARIO) echo "disabled";?>>
				      		<img src="images/icons/32x32/application_add.png" />
				      	</button>
				  
				      	<button type="button" class="btn my_btn btn-light" id="btn_mostrar_modal_borrar_bloque_registro" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" <?php if($rol!=ROL_ADMIN && $rol!=ROL_SUPERUSUARIO) echo "disabled";?> >
				      		<img src="images/icons/32x32/application_form_delete.png" />
				      	</button>
				     </div>
				  </div>
				</div>

				<!-- contenido de la tabla ------------>				
				<div style="/*overflow: auto; white-space: nowrap;*/">
					<table id="my_table_sorter" class="table table-bordered table-striped">
						<thead class="thead-dark"> <!-- add class="thead-light" for a light header -->
							<tr>
								<th>
									<input type="checkbox" id="checkbox_all_registers" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true">&nbsp;&nbsp;#</th>
								<th class="filter-match">ID BD</th>
								<th class="filter-match">Fecha Registro</th>
								<th class="filter-match">Nombre</th>
								<th class="filter-match">Descripción</th>
								<th class="sorter-false filter-false">Acciones</th> <!-- con los atributos data-sorter="false" data-filter="false" desabilita el filtro, o la class="sorter-false filter-false" -->
							</tr>								
						</thead>
						<tfoot>
							<tr>
								<th colspan="6" class="ts-pager">
									<div class="form-inline">
										<div class="btn-group btn-group-sm mx-1" role="group">
											<button id="bt_pager_first" type="button" class="btn btn-secondary first" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true">&#8676;</button>
											<button id="bt_pager_prev" type="button" class="btn btn-secondary prev"  data-toggle="popover" title="" data-placement="left" data-content="" data-html="true">&larr;</button>
										</div>
										<span class="pagedisplay"></span>
										<div class="btn-group btn-group-sm mx-1" role="group">
											<button id="bt_pager_next" type="button" class="btn btn-secondary next" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true">&rarr;</button>
											<button id="bt_pager_last" type="button" class="btn btn-secondary last" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true">&#8677;</button>
										</div>
										<select id="se_num_elem" class="form-control my_form-control-sm custom-select px-1 pagesize" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true" style="width: 72px;">
											<option selected="selected" value="15">15</option>
											<option value="50">50</option>
											<option value=100>100</option>
											<option value="all">Todos</option>
										</select>
										<select id="se_num_pag" class="form-control my_form-control-sm custom-select px-4 mx-1 pagenum" data-toggle="popover" title="" data-placement="left" data-content="" data-html="true"></select>
									</div>
								</th>
							</tr>
						</tfoot>
						<tbody>
						<?php
							if($activar_busqueda_inicial){
								//si existen registros de  la busqueda
								if(count($records)>0){
									$contador = 1; //contador para los registros mostrados
									foreach($records as $record){
																	
										echo '<tr>';
										echo '<td><input type="checkbox" id="checkbox_reg_'.$record->estado_registro_id.'">&nbsp;&nbsp;' . ($contador++) .'</td>';
										echo '<td>'. $record->estado_registro_id.'</td>';
										echo '<td>'.$record->fecha_registro.'</td>';
										echo '<td><div id="reg_div_id_'.$record->estado_registro_id.'">'.$record->nombre.'</div></td>';
										echo '<td>'.$record->descripcion.'</td>';
										echo '<td>'; 

										//botones de duplicar
										if($activar_funcion_duplicar){
											echo '<button type="button" id="btn_duplicar_cascada_' . $record->estado_registro_id . '" class="btn my_btn btn-light btn_duplicar_cascada" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" ' . $enable_component . '>';
											echo '<img class="icons24x24" src="images/icons/32x32/application_cascade.png" />';
											echo '</button>';
											
											echo '<button type="button" id="btn_duplicar_actualizar_' . $record->estado_registro_id . '" class="btn my_btn btn-light btn_duplicar_actualizar" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" '.$enable_component.'>';
											echo '<img class="icons24x24" src="images/icons/32x32/application_double.png" />';
											echo '</button>';
										}

										echo '<button type="button" id="btn_editar_' . $record->estado_registro_id . '" class="btn my_btn btn-light btn_editar" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" '.$enable_component.'>';
										echo '<img class="icons24x24" src="images/icons/32x32/application_edit.png" />';
										echo '</button>';
										
										echo '<button type="button" id="btn_borrar_' . $record->estado_registro_id . '" class="btn my_btn btn-light btn_borrar" data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" '.$enable_component.'>';
										echo '<img class="icons24x24" src="images/icons/32x32/application_delete.png" />';
										echo '</button>';

										echo '</td>';
										echo '</tr>';
									}

								}
								else{
									echo 'No Data';
								}
							}//end busqueda inicial
						?>
						</tbody>
					</table>

				</div>

			</div>
		</div>
	
	
	</div>

<!--====================================================================================================================================-->	
<!-- MODALS ------------------------------------------------------------------------------------------------------------------------------>

<!-- MODAL NUEVO - EDITAR - DUPLICAR -------------------------------------------------------------------------->
<div id="modal_nuevo_edit_duplicar_borrar" class="modal my_modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="barra_distintiva_color"></div>
      <div class="modal-body">

      	  <input type="hidden" id="hd_registro_id" name="hd_registro_name" value="">
 
 		   <div class="form-group">
      	  		<label id="modal_label_msg" style="font-weight: bold; color: red;">MSG</label>
		  </div>

		    <div class="form-group">
		    	<input type="checkbox" id="cb_edit_check_modal"><label> Editar</label>
		  	</div>
		  	
		   <div class="form-group">
		  		<div class="my_modal_campo_container">
		  			<div class="my_modal_campo_label"><label for="tb_id" >Id</label></div>
		  			<div class="my_modal_campo"><input type="text" class="form-control my_form-control" id="tb_id" name="tb_id" value="" disabled></div>
		  		</div>
		  		<div class="my_modal_campo_container">
		  			<div class="my_modal_campo_label"><label for="tb_fecha_registro_id" disabled>Fecha Registro</div>
		  			<div class="my_modal_campo"><input type="text" class="form-control my_form-control" id="tb_fecha_registro_id" name="tb_fecha_registro" value=""></div>
		  		</div>
		  		
		  		<div class="my_modal_campo_container">
		  			<div class="my_modal_campo_label"><label for="tb_nombre_id">Nombre *</div>
		  			<div class="my_modal_campo"><input type="text" class="form-control my_form-control" id="tb_nombre_id" name="tb_nombre" value=""></div>
		  		</div>

		  		<div class="my_modal_campo_container" style="height: 90px;">
		  			<div class="my_modal_campo_label" style="height: 79px;"><label for="ta_descripcion_id">Descripción</div>
		  			<div class="my_modal_campo"><textarea class="form-control my_form-control" id="ta_descripcion_id" rows="3"></textarea></div>
		  		</div>
				
		  	
		  </div>
		  <div class="form-group" style="text-align: right; color: #aaaaaa; width: 100%;">Los campos con * son obligatorios.</div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" class="btn btn-warning" id="btn_editar_ejecutar">Guardar Edición</button>
        <button type="button" class="btn btn-success btn-nuevo" id="btn_nuevo_ejecutar">Guardar Nuevo</button>
        <button type="button" class="btn btn-primary mybtn-duplicar" id="btn_duplicar_ejecutar">Guardar Duplicado Editado</button>
        <button type="button" class="btn btn-danger" id="btn_borrar_ejecutar">Borrar</button>
      </div>
      </div>
    </div>
  </div>
</div>


<!-- MODAL BUSCAR -------------------------------------------------------------------------->
<div id="modal_buscar" class="modal my_modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="barra_distintiva_color"></div>
      <div class="modal-body">
      	  
 		   <div class="form-group">
      	 		<button type="button" id="btn_buscar_uncheck_checkboxes" class="btn my_btn btn-light" data-toggle="popover" title="" data-placement="left" data-content="">
					<img class="icons24x24" src="images/icons/32x32/check_boxes.png" />
				</button>
				<button type="button" id="btn_buscar_reiniciar_campos" class="btn my_btn btn-light" data-toggle="popover" title="" data-placement="left" data-content="">
					<img class="icons24x24" src="images/icons/32x32/draw_eraser.png" />
				</button>
		   </div>

		   <div class="form-group">
      	  		<label id="modal_buscar_label_msg">MSG</label>
		   </div>

          
		   <div class="form-group">
		  		<div class="my_modal_campo_container">
		  			<div class="my_modal_buscar_cb" style="height: 36px;"><input type="checkbox" id="cb_buscar_campo_id"></div>
		  			<div class="my_modal_campo_label" style="padding-left: 3px;"><label for="tb_buscar_campo_id" >Id</label></div>
		  			<div class="my_modal_campo"><input type="text" class="form-control my_form-control" id="tb_buscar_campo_id" name="tb_buscar_campo_id" value=""  disabled></div>

		  		</div>
		  		<div class="my_modal_campo_container">
		  			
		  			<div class="my_modal_buscar_cb" style="height: 53px;"><input type="checkbox" id="cb_buscar_campo_fecha_registro"></div>
		  			
		  			<div class="my_modal_campo_label">
		  				<label for="tb_fecha_registro_id">Fecha Registro</div>
		  			
		  			<div class="my_modal_campo_label" style="width: 52px; text-align: right;">
		  				<label for="tb_buscar_campo_fecha_registro_inicial_id">Inicial</div>
		  			<div class="my_modal_campo" style="width: 120px;">
		  				<input type="text" class="form-control my_form-control" id="tb_buscar_campo_fecha_registro_inicial_id" name="tb_buscar_campo_fecha_registro_inicial" value=""  disabled></div>
		  			
		  			<div class="my_modal_campo_label" style="width: 52px;text-align: right;">
		  				<label for="tb_buscar_campo_fecha_registro_final_id">Final</div>
		  			<div class="my_modal_campo" style="width: 120px;">
		  				<input type="text" class="form-control my_form-control" id="tb_buscar_campo_fecha_registro_final_id" name="tb_buscar_campo_fecha_registro_final" value="" disabled></div>
		  		</div>
		  		
		  		<div class="my_modal_campo_container">
		  			<div class="my_modal_buscar_cb" style="height: 36px;"><input type="checkbox" id="cb_buscar_campo_nombre"></div>
		  			<div class="my_modal_campo_label"><label for="tb_buscar_campo_nombre_id">Nombre</div>
		  			<div class="my_modal_campo"><input type="text" class="form-control my_form-control" id="tb_buscar_campo_nombre_id" name="tb_buscar_campo_nombre" value="" disabled></div>
		  		</div>

		  		<div class="my_modal_campo_container" style="height: 90px;">
		  			<div class="my_modal_buscar_cb" style="height: 79px;"><input type="checkbox" id="cb_buscar_campo_descripcion"></div>
		  			<div class="my_modal_campo_label" style="height: 79px;"><label for="ta_buscar_campo_descripcion_id">Descripción</div>
		  			<div class="my_modal_campo"><textarea class="form-control my_form-control" id="ta_buscar_campo_descripcion_id" rows="3" disabled></textarea></div>
		  		</div>
		  		

		  	
		  </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-primary" id="btn_buscar_ejecutar">Buscar</button>
      </div>
      </div>
    </div>
  </div>
</div>


<!-- MODAL BORRAR REGISTROS SELECCIONADOS-------------------------------------------------------------------------->
<div id="modal_borrar" class="modal my_modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="barra_distintiva_color"></div>
      <div class="modal-body">
		  <div class="form-group">
		    <label>texto</label>
		  </div>
		  <div class="form-group">
		    <textarea rows="10" cols="62">registros</textarea> 
		  </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="submit" class="btn btn-danger" id="btn_borrar_bloque_ejecutar">Borrar Seleccionados</button>
      </div>
      </div>
    </div>
  </div>
</div>


<!-- MODAL MENSAJES DE ERROR-------------------------------------------------------------------------->
<div id="modal_mensajes_error" class="modal my_modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Mensaje</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="barra_distintiva_color"></div>
      <div class="modal-body">
		 
		  <div class="form-group" <?php if($rol!=ROL_ADMIN) echo "style='display: none;'"; ?>>
        	<input type="checkbox" id="modal_mensajes_error_cb_mostrar_msg_raw"><label> Ver mensaje del sistema</label>
		  </div>

		  <div class="form-group">
		    <textarea id="modal_mensajes_error_msg_interpretado" rows="7" cols="60" style="border: 1px solid red; padding: 6px;">mensaje</textarea> 
		  </div>
		  <div class="form-group" >
		    <textarea id="modal_mensajes_error_msg_raw" rows="7" cols="60" style="border: 1px solid red; padding: 6px;">mensaje de programacion</textarea> 
		  </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary"  id="modal_mensajes_error_btn_cerrar_id">Cerrar</button>
      </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL SELECCION DE CAMPOS-------------------------------------------------------------------------->
<div id="modal_seleccion_campos_visibles" class="modal my_modal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-sm" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Selección de Campos</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
		  <div class="form-group"  style="padding-left: 5px;">
		 	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campos_todos"><label>&nbsp;&nbsp;Seleccionar todos</label></div>
          </div>
		 <div class="form-group"  style="padding-left: 20px;">
		 	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campo_index" my_campo_tabla="1"><label>&nbsp;&nbsp;#</label></div>
        	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campo_id" my_campo_tabla="2"><label>&nbsp;&nbsp;ID</label></div>
        	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campo_fecha_registro" my_campo_tabla="3"><label>&nbsp;&nbsp;Fecha Registro</label></div>
		  	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campo_nombre" my_campo_tabla="4"><label>&nbsp;&nbsp;Nombre</label></div>
		  	<div style="display: flex; align-items: center;"><input type="checkbox" id="cb_modal_seleccion_campo_descripcion" my_campo_tabla="5"><label>&nbsp;&nbsp;Descripción</label></div>
		  	
      	</div>
      	</div>
      	<div class="modal-footer">
        	<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
      	</div>
      </div>
    </div>
  </div>
</div>

	
<!--===============================================================================================-->	
<!-- SCRIPS SE DEBEN DE EJECUTAR UNA VES QUIE YA SE CARGO TODA LA PAGINA-->
<script type="text/javascript" src="jquery/jquery-3.5.0.min.js"></script>
<script type="text/javascript" src="bootstrap-4.4.1/js/bootstrap.bundle.min.js"></script>
<script type="text/javascript" src="tablesorter_v2.31.3/js/jquery.tablesorter.js"></script>
<script type="text/javascript" src="tablesorter_v2.31.3/js/jquery.tablesorter.widgets.js"></script>
<script type="text/javascript" src="tablesorter_v2.31.3/pager/jquery.tablesorter.pager.js"></script>
<script type="text/javascript" src="jquery-ui-1.12.1/jquery-ui.min.js"></script>


<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/codigos_error.js"></script>
<script type="text/javascript" src="js/popover_msg.js"></script>    

<script type="text/javascript" src="js/my_util.js"></script><!-- Funciones genericas de uso comun-->    
<script type="text/javascript" src="js/header.js"></script>   
<script type="text/javascript" src="js/estadoregistros.js"></script>		
 
<script type="text/javascript" src="js/loader.js"></script>	<!--LOADER-->	


<!--===============================================================================================-->

</body>
</html>
$(function() {

	//DEFINICION VARIABLES GLOBALES

	//obtenemos el valor del rol del input hidden
	var rol = parseInt( $("#hd_rol_id").val() );

	//obtenemos el valor del rol del input hidden
	var activar_funcion_duplicar = ( $("#hd_activar_funcion_duplicar").val() )? true : false;

	var mostrar_todas_columnas = false;
	var numero_filtros_tabla = 10; //se usa cuando se agregan popovers a los filtros, en la funcion pintarPopoversSobreFiltrosTabla()


	var columna_estado_registros = 10; //es para saber en que columa estan mostrados el estado d¿registro, para poder apuntar y tomar ese valoir para pintar colores.
	var columna_botones_acciones = 11; //es para saber en que columa estan mostrados los botones de las acciones.



	//esta es la lista del estado en el que se muestran los campos
	//                                       index,    id, fecha,  rpe, nombres, a paterno, a materno, email, habilitado, estado_registro
	//                           posiciones    0      1       2     3       4            5          6,     7,          8,               9  
	var lista_campos_mostrados_default     = [true, false, false, true,    true,      true,      true,  true,      false,           false ]; //esta tabla no cambia es la default
	var lista_campos_mostrados 		       = [true, false, false, true,    true,      true,      true,  true,      false,           false ];
	var lista_campos_mostrados_habilitados = [true,  true,  true, true,    true,      true,      true,  true,       true,             true]; //los campos con true solo son mostrados al perfil del admin
	var campo_mostrar_minimo_default = 3; //posicion del arreglo, no de la columnas

	//se ocupa para guaradar los parametros de la ultima busqueda, esto es para recordar la busqueda anterior al momento de volver a llamar los datos 
	//de la base (en el refrescado). Esta busqueda depende de la seleccion de busqueda que se alla hecho, pero el usuario puede haber cambiado los
	//parametros en el modal buscar, sin realizar la busqueda, entonces al refrescar ocupara los cambios del usuario, pero si este realmente no busco asi 
	//y los altero, entonces abra una incosistencia.
	//Parametros:                id, rpe, nombres, apellido, apellido, email, habilitado, fecha registro, fecha registro, estado_registro_id
	//                                              paterno   materno                            inicial           final 
	var busqueda_parametros = [null,null,    null,     null,     null,  null,       null,           null,           null,                null];
	
	var retornar_ventana_despues_de_error = false;

	//=== TABLESORTER==============================================================================================================================
	// --------------------------------------------------------------------------------------------------------------
	//NOTA: en los filtros la deshabilitacion de la columna acciones esta definida en la tabla html con 
	//     las clases data-sorter="false" data-filter="false" 
	
	$("#my_table_sorter").tablesorter({
	
		theme : "bootstrap",

		// widget code contained in the jquery.tablesorter.widgets.js file
		// use the zebra stripe widget if you plan on hiding any rows (filter widget)
		// the uitheme widget is NOT REQUIRED!
		widgets : [ "filter", "columns", "zebra", 'resizable', 'stickyHeaders', 'scroller' ],

		widgetOptions : {
			// using the default zebra striping class name, so it actually isn't included in the theme variable above
			// this is ONLY needed for bootstrap theming if you are using the filter widget, because rows are hidden
			zebra : ["even", "odd"],

			// class names added to columns when sorted
			//columns: [ , "primary", "secondary", ,"tertiary" ],
			columns: [ , , "secondary", "primary","tertiary" ],

			resizable: false,
			//resizable_addLastColumn : true,
     
		     // These are the default column widths which are used when the table is
		     // initialized or resizing is reset; note that the "Age" column is not
		     // resizable, but the width can still be set to 40px here
		     //resizable_widths : [ '100px','100px', '160px', '110px', , , , ,'50px','140px', '150px'],
		     resizable_widths : [ '100px','100px', '160px', '110px', , , , ,'50px','140px', '158px'],

			// jQuery selector string of an element used to reset the filters
      		filter_reset : 'button.reset', //la clase reset en algun button

      		// Reset filter input when the user presses escape - normalized across browsers
      		filter_resetOnEsc : true,


			// if true, a filter will be added to the top of each table column;
		      // disabled by using -> headers: { 1: { filter: false } } OR add class="filter-false"
		      // if you set this to false, make sure you perform a search using the second method below
		      filter_columnFilters : true,

		     //headers: { 3: { filter: false} },


			// extra css class name (string or array) added to the filter element (input or select)
			filter_cssFilter: [
				'form-control',  //numero de fila, no viene de la base de datos solo es un conteo
				'form-control',  //id de la base de datos
				'form-control', //fecha del registro d ela base de datos
				'form-control', //rpe del registro de la base de datos
				'form-control', //nombre del registro de la base de datos
				'form-control', //apellido paterno del registro de la base de datos
				'form-control', //apellido materno del registro de la base de datos
				'form-control', //email
				'form-control custom-select', //habilitado del registrto en la base de datos
				'form-control custom-select', //estado del registro en la base de datos
				'form-control'  //acciones operativas
			],


			


			
		}
	})
	.tablesorterPager({

		// target the pager markup - see the HTML block below
		container: $(".ts-pager"),

		// target the pager page select dropdown - choose a page
		cssGoto  : ".pagenum",

		// remove rows from the table to speed up the sort of large tables.
		// setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
		removeRows: false,

		// output string - default is '{page}/{totalPages}';
		// possible variables: {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
		output: '{startRow} - {endRow} / {filteredRows} ({totalRows})'

	});//end initTable	


	//-------------------------------------------------------------------------------------------------------------------
	//actualiza parametris de la tabla 
	var updateTableParameters = function(){

		if(!activar_funcion_duplicar){
			
			$("#my_table_sorter")[0].config.widgetOptions.resizable_widths = [ '100px','100px', '160px', '110px', , , , ,'50px','140px', '90px' ];
			$("#my_table_sorter").trigger("applyWidgets");
			$("#my_table_sorter").trigger("updateAll");
			
			
		}
	}


	//===AJAX==============================================================================================================================
	//funciones que ocupan Ajax --------------------------------------------------------------------------------------------------------------

	
	//Ejecutar Borrar Registros a traves de ajax -----------------------------------------------
	var ejecutarBuscarRegistrosAjax = function(id, rpe, nombres, apellido_paterno, apellido_materno, email, habilitado, fecha_registro_inicial, fecha_registro_final, estado_registro_id){

		var obj = new Object();
		obj.id = id;
		obj.rpe = rpe;
		obj.nombres = nombres;
		obj.apellido_paterno = apellido_paterno;
		obj.apellido_materno = apellido_materno;
		obj.email = email;
		obj.habilitado = habilitado;
		obj.fecha_registro_inicial = fecha_registro_inicial;
		obj.fecha_registro_final   = fecha_registro_final;
		obj.estado_registro_id = estado_registro_id;
    	var obj_json = JSON.stringify(obj);
		//alert("obj_json: "+obj_json);	
		$.ajax({
            url : 'ajax_usuarios.php',    // la URL para la petición
    	    type: 'POST',              // http method
    	    async: true,		// llamada de tipo asincrona
    	    cache: false,
    	    dataType : 'text',        // el tipo de información que se espera de respuesta
    	    data: { 'funcion' : 'buscar_registros', 'datos' : obj_json },  // data to submit
    	    success: function (data, status, xhr) {
    	    	var obj = JSON.parse(data); //combierte json a objeto
    	    	//alert('status: ' + status + ', data: ' + data+', xhr: '+xhr);
    	    	var records = obj.records;
    	    	var contenido="d";
    	    	for(var i=0 ; i<records.length ; i++){


    	    		    var usuario_id = records[i].usuario_id;
						var rpe         = records[i].rpe;
						var nombres         = records[i].nombres;
						var apellido_paterno         = records[i].apellido_paterno;
						var apellido_materno         = records[i].apellido_materno;
						var email         = records[i].email;
						var habilitado    = records[i].habilitado;
						var fecha_registro = records[i].fecha_registro;
						var estado_registro_id = records[i].estado_registro_id;
						var estado_registro_nombre = records[i].estado_registro_nombre;

						//ajuste de textos -------------------------------------
						apellido_materno = (apellido_materno==null)?'':apellido_materno;
						email            = (email==null)?'':email;
						
    	  				// construccion del contenido de la tabla ---------------------------------------------------------------------------
						contenido += "<tr>";
    	    			contenido += '<td><input type="checkbox" id="checkbox_reg_'  + usuario_id + '">&nbsp;&nbsp;' + (i+1) + '</td>';
    	    			contenido += '<td>' + usuario_id + '</td>';
    	    			contenido += '<td>' + fecha_registro + '</td>';
    	    			contenido += '<td><div id="reg_div_id_' + usuario_id + '">' + rpe +'</div></td>';
    	    			contenido += '<td>' + nombres + '</td>';
    	    			contenido += '<td>' + apellido_paterno + '</td>';
    	    			contenido += '<td>' + apellido_materno + '</td>';
    	    			contenido += '<td>' + email + '</td>';
						contenido += '<td habilitado="' + habilitado + '">' + ((habilitado=='1')? 'Si':'No') + '</td>';									
    	    			contenido += '<td estado_registro_id="' + estado_registro_id + '"><div>' + estado_registro_nombre + '</div></td>';
    	    			contenido += '<td>';

    	    			//funciones de duplicar ------------
    	    			if(activar_funcion_duplicar){
	    	    		 
	    	    			contenido += '<button type="button" id="btn_duplicar_cascada_' + usuario_id + '" class="btn my_btn btn-light btn_duplicar_cascada" \
	    	    			               data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="">';
							contenido += '<img class="icons24x24" src="images/icons/32x32/application_cascade.png" />';
							contenido += '</button>';
							contenido += '<button type="button" id="btn_duplicar_actualizar_' + usuario_id + '" class="btn my_btn btn-light btn_duplicar_actualizar" \
	    	    			               data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="">';
							contenido += '<img class="icons24x24" src="images/icons/32x32/application_double.png" />';
							contenido += '</button>';
						}//end botones duplicar

						contenido += '<button type="button" id="btn_editar_' + usuario_id + '" class="btn my_btn btn-light btn_editar" \
						               data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" />';
						contenido += '<img class="icons24x24" src="images/icons/32x32/application_edit.png" />';
						contenido += '</button>';
						contenido += '<button type="button" id="btn_borrar_' + usuario_id + '" class="btn my_btn btn-light btn_borrar" \
						               data-container="body" data-toggle="popover" title=""  data-placement="left" data-content="" />';
						contenido += '<img class="icons24x24" src="images/icons/32x32/application_delete.png" />';
						contenido += '</button>';
						contenido += '</td>';
						contenido += '</tr>';
    	    	}

    	    	//alert(contenido);
    	    	//escribimos el nuevo contenido
    	    	$("#my_table_sorter tbody").html(contenido);
    	    	 //actualiza el funcionamiento del table sorter sobre los nuevos elementos (solo los pertenecientes al tablesorter)
    	    	$("#my_table_sorter").trigger("updateAll");
    	    	 //por si quedan elementos duplicados, definimos que no los deje (esto talvez no es necesario porque sobreescribimos todo el contenido del tbody)
    	    	$("#my_table_sorter").trigger("appendCache");

    			//---------------------------------------------------------------------
    			//recargamos los componentes nuevis ya que son creados depues de la definicion de su existencia en la carga inicial del html
    			//recargamos los componentes nuevos de este jquery(ready)
    			recargarComponentsJquery();    			
    			//validamos el estado de los popover en los nuevos pintados
    			//la funcion esta declarada en un scope diferente (superior) que es windows
    			window.initComponentsHeaderJquery(); //funcion definida en header.js
    			//--------------------------------------------------------------------

    			if(obj.estado_proceso == "ERROR"){
          			alert(obj.estado_proceso+"  :: "+obj.msn);
          		}
    	    	
    	    },
    	    error: function (jqXhr, textStatus, errorMessage) {
    	            //$("#my_id1").append('Error' + errorMessage);
    	            alert('Error' + errorMessage);

    	    },
    	    // código a ejecutar sin importar si la petición falló o no
		    complete : function(xhr, status) {
		         $('#modal_buscar').modal('hide');//mostramos la ventana modal
		    }
    	});
	}




		//Carga todos los componentes del tablesorter -----------------------------------------------
	var cargarUltimaBusquedaTableSorterAjax = function(){
    	//ejecutarBuscarRegistrosAjax(null, null, null, null, null, null, null, null, null, null); 
    	var id                     = busqueda_parametros[0]
    	var rpe                    = busqueda_parametros[1];
    	var nombres                = busqueda_parametros[2];
    	var apellido_paterno       = busqueda_parametros[3];
    	var apellido_materno       = busqueda_parametros[4];
    	var email                  = busqueda_parametros[5];
    	var habilitado             = busqueda_parametros[6];
    	var fecha_registro_inicial = busqueda_parametros[7];
    	var fecha_registro_final = busqueda_parametros[8];
    	var estado_registro_id   = busqueda_parametros[9]; 
    	 
        ejecutarBuscarRegistrosAjax(id, rpe, nombres, apellido_paterno, apellido_materno, email, habilitado, fecha_registro_inicial, fecha_registro_final, estado_registro_id);
		
    
	}




	//Ejecutar Nuevo o Editar un nuevo registro a traves de ajax -----------------------------------------------
	var ejecutarCrearEditarRegistroAjax = function(tipo_funcion, id, nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, estado_registro_id){
		var obj = new Object();
		obj.id = id;
		obj.nombres = nombres;
		obj.apellido_paterno = apellido_paterno;
		obj.apellido_materno = apellido_materno;
		obj.rpe = rpe;
		obj.email = email;
		obj.habilitado = habilitado;
		obj.estado_registro_id = estado_registro_id;
    	var obj_json = JSON.stringify(obj);
    	$.ajax({
            url : 'ajax_usuarios.php',    // la URL para la petición
    	    type: 'POST',       // http method
    	    async: true,		// llamada de tipo asincrona		
        	dataType : 'text',  // el tipo de información que se espera de respuesta
    	    data: { 'funcion' : tipo_funcion, 'datos' : obj_json },  // data to submit
    	    success: function (data, status, xhr) {
    	    	var obj = JSON.parse(data); //combierte json a objeto
    	    	//alert('status: ' + status + ', data: ' + data+', xhr: '+xhr);
    	    	if(obj.estado_proceso == "ERROR"){
    	    		//alert(obj.estado_proceso+"  :: "+obj.msn);
          			var my_error_msg = validarCodigoError(obj.error_codes); //esta funcion esta definida en codigos_error.js
          			showErrorMessages(obj.id, obj.error_codes, obj.error_msg, my_error_msg);
          		
          		}
    	    },
    	    error: function (jqXhr, textStatus, errorMessage) {
    	            //$("#my_id1").append('Error' + errorMessage);
    	            alert('Error' + errorMessage);
    	    },
    	    // código a ejecutar sin importar si la petición falló o no
		    complete : function(xhr, status) {
		    	cargarUltimaBusquedaTableSorterAjax();
		        $('#modal_nuevo_edit_duplicar_borrar').modal('hide');//oculta la ventana modal
		    }
    	});
	}


	//Ejecutar Borrar Registros a traves de ajax -----------------------------------------------
	var ejecutarBorrarRegistrosAjax = function(lista_ids){
		var obj = new Object();
		obj.lista_ids = lista_ids;
		var obj_json = JSON.stringify(obj);
    	$.ajax({
            url : 'ajax_usuarios.php',    // la URL para la petición
    	    type: 'POST',       // http method
    	    async: true,		// llamada de tipo asincrona		
        	dataType : 'text',  // el tipo de información que se espera de respuesta
    	    data: { 'funcion' : 'borrar_registro', 'datos' : obj_json },  // data to submit
    	    success: function (data, status, xhr) {
    	    	var obj = JSON.parse(data); //combierte json a objeto
    	    	//alert('status: ' + status + ', data: ' + data+', xhr: '+xhr);
    	    	//alert(obj.estado_proceso.length);
    	    	var error=false;
    	    	var error_ids = new Array();
    	    	var error_codes = new Array();
    	    	var error_msgs = new Array();
    	    	var my_error_msgs = new Array();
    	    	
    	    	for(var i=0 ; i <obj.estado_proceso.length ; i++){
	    	    	if(obj.estado_proceso[i] == "ERROR"){
	          			error = true;
	          			var my_error_msg = validarCodigoError(obj.error_codes[i]); //esta funcion esta definida en codigos_error.js
	          			error_ids.push(obj.id[i]);
	          			error_codes.push(obj.error_codes[i]);
	          			error_msgs.push(obj.error_msg[i]);
    	    			my_error_msgs.push(my_error_msg);
	          			//alert(obj.estado_proceso+"  :: "+obj.msn);
	          		}//end if
	          	}//end for

	          	if(error){
	          		showErrorMessages(error_ids,error_codes, error_msgs, my_error_msgs);	          			
	          	}
    	    },
    	    error: function (jqXhr, textStatus, errorMessage) {
    	            //$("#my_id1").append('Error' + errorMessage);
    	            alert('Error' + errorMessage);
    	    },
    	    // código a ejecutar sin importar si la petición falló o no
		    complete : function(xhr, status) {
		    	cargarUltimaBusquedaTableSorterAjax();
		    	//ocultamos las dos ventanas de borrar
		        $('#modal_borrar').modal('hide');//oculta la ventana modal
		        $('#modal_nuevo_edit_duplicar_borrar').modal('hide');//ocultamos la ventana modal
		    }
    	});
	}
	



	
  	//===BOTONES POR REGISTRO DEFINIR EVENTOS==============================================================================================================================
	// Botones para abrir modal, definidos por cada registro -----------------------------------------------------------------------------------------------
	
	//boton por registro ver (link en el nombre del registro) -----------------------------------------
	var definirBotonVerRegistroVerVentanaModal = function(){
		$( "[id^='reg_div_id_']").click(function() {

			
			var renglon_id = $(this).attr("id").substring(11);
			var renglon_fecha_registro   = $(this).parent().parent().find("td:nth-child(3)").text();
		    var renglon_rpe 			 = $(this).parent().parent().find("td:nth-child(4)").text();
		    var renglon_nombres          = $(this).parent().parent().find("td:nth-child(5)").text();
		    var renglon_apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text();
		    var renglon_apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text();
		    var renglon_email            = $(this).parent().parent().find("td:nth-child(8)").text();
		    var renglon_habilitado       = $(this).parent().parent().find("td:nth-child(9)").attr("habilitado");
		    var renglon_estado_registro_id = $(this).parent().parent().find("td:nth-child(10)").attr("estado_registro_id");


			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Ver Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_ver);  //color del encabezado de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_ver);  //color de las letras del encabezado de la ventana

			//campo oculto--------------------------------------------------
			$('#hd_registro_id').val(renglon_id); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)

			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().hide();

			
			//checkbox de edicion-------------------
			//si el rol es 1. admin ó 2. superusuario
			if(rol==ROL_ADMIN || rol==ROL_SUPERUSUARIO)
				$('#cb_edit_check_modal').parent().show();
			else
				$('#cb_edit_check_modal').parent().hide();

			//campos que solo ve el administrador-------------------
			if(rol==ROL_ADMIN){
				$('#tb_id').parent().parent().show();
				$('#tb_fecha_registro_id').parent().parent().show();
			}
			else{
				$('#tb_id').parent().parent().hide();
				$('#tb_fecha_registro_id').parent().parent().hide();	
			}

			//-- CAMPOS --------------------------------------------------------------------------------------------------------
			$('#tb_id').val(renglon_id);//campo id (siempre desabilitado)
			$('#tb_fecha_registro_id').val(renglon_fecha_registro); //input text fecha_registro (es un componente input por eso se ocupa val)
			$('#tb_rpe_id').val(renglon_rpe); //input text rpe inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_nombres_id').val(renglon_nombres); //input text nombres inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_apellido_paterno_id').val(renglon_apellido_paterno); //input text apellido paterno  (es un componente input por eso se ocupa val)
			$('#tb_apellido_materno_id').val(renglon_apellido_materno); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#tb_email_id').val(renglon_email); //input text email  (es un componente input por eso se ocupa val)
			$('#se_habilitado_id').val(renglon_habilitado); //1 si (true), 0 no (false).
			$('#se_estado_registro_id').val(renglon_estado_registro_id); //1 nuevo. inicializamos el valor

			$('#cb_edit_check_modal').prop("checked", false);
			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", true); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", true); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", true); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", true); //input text email (enable)
			$('#se_habilitado_id').prop("disabled", true);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", true);  //valor del estado registro habilitado (enable)
			
			//botones de la pagina modal -------------------------------------------------------------
			$("#btn_nuevo_ejecutar").hide(); //mostramos el boton de guardar nuevo registro
			$("#btn_editar_ejecutar").hide(); //ocultamos el boton de guardar editar registro
			$("#btn_duplicar_ejecutar").hide(); //mostramos el boton de guardar duplicado registro
			$("#btn_borrar_ejecutar").hide(); //ocultamos el boton de borrar registro
			
		
			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//mostramos la ventana modal*/

		});
	}

	//boton duplicar -----------------------------------------
	var definirBotonDuplicarCascada = function(){

		$( ".btn_duplicar_cascada" ).click(function() {
			//liberamos los popover para que no se dupliquen
			liberarPopovers();
		
		    var id = $(this).attr("id").substring(21);
			var rpe 			 = $(this).parent().parent().find("td:nth-child(4)").text().trim();
		    var nombres          = $(this).parent().parent().find("td:nth-child(5)").text().trim();
		    var apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text().trim();
		    var apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text().trim();
		    var email            = $(this).parent().parent().find("td:nth-child(8)").text().trim();
		    var habilitado       = $(this).parent().parent().find("td:nth-child(9)").attr("habilitado");
		    var estado_registro_id = estado_registro_id_duplicado_en_cascada;  //el 5 es el estado duplicado en cascada (definido en config.js)

		    var today = fechaHoy(); //funcion que obtiene la fecha de hoy en formato yyy-mm-dd HH:ii:ss.ms definida en mu_util.js
		   
		    nombres += " ("+ today+")"; 
		    //validamos los campos ------
			if(validarCampos(rpe, nombres, apellido_paterno,email)){
		   		//realizamos la creacion o modificacion del registro		
				ejecutarCrearEditarRegistroAjax("nuevo_registro", null, nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, estado_registro_id);
			}
		});
	}

	//boton duplicar actualizar-----------------------------------------
	var definirBotonDuplicarActualizar = function(){
		//console.log("FuncionDuplicarActualizar "); //envia mensaje a la consola de depuracion (normalmente F12)
		$( ".btn_duplicar_actualizar" ).click(function() {
			var renglon_id = $(this).attr("id").substring(24);
			var renglon_fecha_registro   = $(this).parent().parent().find("td:nth-child(3)").text();
		    var renglon_rpe 			 = $(this).parent().parent().find("td:nth-child(4)").text();
		    var renglon_nombres          = $(this).parent().parent().find("td:nth-child(5)").text();
		    var renglon_apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text();
		    var renglon_apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text();
		    var renglon_email            = $(this).parent().parent().find("td:nth-child(8)").text();
		    var renglon_habilitado       = $(this).parent().parent().find("td:nth-child(9)").attr("habilitado");
		    //var renglon_estado_registro_id = $(this).parent().parent().find("td:nth-child(10)").attr("estado_registro_id");
		    var renglon_estado_registro_id = estado_registro_id_duplicado;

		    
		    //alert(renglon_estado_registro_id);
			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Duplicar Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_duplicar);  //color del encabezado de la ventana (verder limon)
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_duplicar);  //color de las letras del encabezado de la ventana

			//campo oculto--------------------------------------------------
			$('#hd_registro_id').val(renglon_id); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)

			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().hide();

			//ocultamos checkbox-----
			$('#cb_edit_check_modal').parent().hide();

			//campos que solo ve el administrador-------------------
			if(rol==ROL_ADMIN){
				$('#tb_id').parent().parent().show();
				$('#tb_fecha_registro_id').parent().parent().show();
			}
			else{
				$('#tb_id').parent().parent().hide();
				$('#tb_fecha_registro_id').parent().parent().hide();	
			}

			//ajusta de datos ------------------------------------------------------------------------------------------------------
			var today = fechaHoy(); //funcion que obtiene la fecha de hoy en formato yyy-mm-dd HH:ii:ss.ms definida en mu_util.js
		    renglon_nombres += " ("+today+")";

			//-- CAMPOS --------------------------------------------------------------------------------------------------------
			$('#tb_id').val(renglon_id);//campo id (siempre desabilitado)
			$('#tb_fecha_registro_id').val(renglon_fecha_registro); //input text fecha_registro (es un componente input por eso se ocupa val)
			$('#tb_rpe_id').val(renglon_rpe); //input text rpe inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_nombres_id').val(renglon_nombres); //input text nombres inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_apellido_paterno_id').val(renglon_apellido_paterno); //input text apellido paterno  (es un componente input por eso se ocupa val)
			$('#tb_apellido_materno_id').val(renglon_apellido_materno); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#tb_email_id').val(renglon_email); //input text email  (es un componente input por eso se ocupa val)
			$('#se_habilitado_id').val(renglon_habilitado); //1 si (true), 0 no (false).
			$('#se_estado_registro_id').val(renglon_estado_registro_id); //1 nuevo. inicializamos el valor

			$('#cb_edit_check_modal').prop("checked", false);
			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", false); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", false); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", false); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", false); //input text email habilitado (enable)
			$('#se_habilitado_id').prop("disabled", false);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", false);  //valor del estado registro habilitado (enable)
			
			//botones de la pagina modal -------------------------------------------------------------
			$("#btn_nuevo_ejecutar").hide(); //mostramos el boton de guardar nuevo registro
			$("#btn_editar_ejecutar").hide(); //ocultamos el boton de guardar editar registro
			$("#btn_duplicar_ejecutar").show(); //mostramos el boton de guardar duplicado registro
			$("#btn_borrar_ejecutar").hide(); //ocultamos el boton de borrar registro

			retornar_ventana_despues_de_error = true;

			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//mostramos la ventana modal*/
			
		});
	}

	//boton editar -----------------------------------------
	var definirBotonEditarMostrarVentanaModal = function(){
		$( ".btn_editar" ).click(function() {
			
			var renglon_id = $(this).attr("id").substring(11);
			var renglon_fecha_registro   = $(this).parent().parent().find("td:nth-child(3)").text();
		    var renglon_rpe 			 = $(this).parent().parent().find("td:nth-child(4)").text();
		    var renglon_nombres          = $(this).parent().parent().find("td:nth-child(5)").text();
		    var renglon_apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text();
		    var renglon_apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text();
		    var renglon_email            = $(this).parent().parent().find("td:nth-child(8)").text();
		    var renglon_habilitado       = $(this).parent().parent().find("td:nth-child(9)").attr("habilitado");
		    var renglon_estado_registro_id = $(this).parent().parent().find("td:nth-child(10)").attr("estado_registro_id");


		    //alert(renglon_estado_registro_id);
			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Editar Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_editar);  //color del encabezado de la ventana (verder limon)
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_editar);  //color de las letras del encabezado de la ventana

			//campo oculto--------------------------------------------------
			$('#hd_registro_id').val(renglon_id); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)

			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().hide();
	
			//checkbox de edicion-------------------
			//si el rol es 1. admin ó 2. superusuario
			if(rol==ROL_ADMIN || rol==ROL_SUPERUSUARIO)
				$('#cb_edit_check_modal').parent().show();
			else
				$('#cb_edit_check_modal').parent().hide();

			//campos que solo ve el administrador-------------------
			if(rol==ROL_ADMIN){
				$('#tb_id').parent().parent().show();
				$('#tb_fecha_registro_id').parent().parent().show();
			}
			else{
				$('#tb_id').parent().parent().hide();
				$('#tb_fecha_registro_id').parent().parent().hide();	
			}

			//-- CAMPOS --------------------------------------------------------------------------------------------------------
			$('#tb_id').val(renglon_id);//campo id (siempre desabilitado)
			$('#tb_fecha_registro_id').val(renglon_fecha_registro); //input text fecha_registro (es un componente input por eso se ocupa val)
			$('#tb_rpe_id').val(renglon_rpe); //input text rpe inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_nombres_id').val(renglon_nombres); //input text nombres inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_apellido_paterno_id').val(renglon_apellido_paterno); //input text apellido paterno  (es un componente input por eso se ocupa val)
			$('#tb_apellido_materno_id').val(renglon_apellido_materno); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#tb_email_id').val(renglon_email); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#se_habilitado_id').val(renglon_habilitado); //1 si (true), 0 no (false).
			$('#se_estado_registro_id').val(renglon_estado_registro_id); //1 nuevo. inicializamos el valor

			$('#cb_edit_check_modal').prop("checked", true);
			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", false); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", false); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", false); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", false); //input text email habilitado (enable)
			$('#se_habilitado_id').prop("disabled", false);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", false);  //valor del estado registro habilitado (enable)
			
			
			//botones de la pagina modal -------------------------------------------------------------
			$("#btn_nuevo_ejecutar").hide(); //mostramos el boton de guardar nuevo registro
			$("#btn_editar_ejecutar").show(); //ocultamos el boton de guardar editar registro
			$("#btn_duplicar_ejecutar").hide(); //mostramos el boton de guardar duplicado registro
			$("#btn_borrar_ejecutar").hide(); //ocultamos el boton de borrar registro

			retornar_ventana_despues_de_error = true;

			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//mostramos la ventana modal*/

		});
	}



	

//boton borrar -----------------------------------------
	var definirBotonBorrarMostrarVentanaModal = function(){	
			//alert($(this).html());
		$( ".btn_borrar" ).click(function() {

		    var renglon_id = $(this).attr("id").substring(11);
			var renglon_fecha_registro   = $(this).parent().parent().find("td:nth-child(3)").text();
		    var renglon_rpe 			 = $(this).parent().parent().find("td:nth-child(4)").text();
		    var renglon_nombres          = $(this).parent().parent().find("td:nth-child(5)").text();
		    var renglon_apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text();
		    var renglon_apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text();
		    var renglon_email            = $(this).parent().parent().find("td:nth-child(8)").text();
		    var renglon_habilitado       = $(this).parent().parent().find("td:nth-child(9)").attr("habilitado");
		    var renglon_estado_registro_id = $(this).parent().parent().find("td:nth-child(10)").attr("estado_registro_id");


		    //alert(renglon_estado_registro_id);
			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Borrar Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_borrar);  //color del encabezado de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_borrar);  //color de las letras del encabezado de la ventana

			//campo oculto--------------------------------------------------
			$('#hd_registro_id').val(renglon_id); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)

			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().hide();
	
			//checkbox de edicion-------------------
			$('#cb_edit_check_modal').parent().hide();

			//campos que solo ve el administrador-------------------
			if(rol==ROL_ADMIN){
				$('#tb_id').parent().parent().show();
				$('#tb_fecha_registro_id').parent().parent().show();
			}
			else{
				$('#tb_id').parent().parent().hide();
				$('#tb_fecha_registro_id').parent().parent().hide();	
			}

			//-- CAMPOS --------------------------------------------------------------------------------------------------------
			$('#tb_id').val(renglon_id);//campo id (siempre desabilitado)
			$('#tb_fecha_registro_id').val(renglon_fecha_registro); //input text fecha_registro (es un componente input por eso se ocupa val)
			$('#tb_rpe_id').val(renglon_rpe); //input text rpe inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_nombres_id').val(renglon_nombres); //input text nombres inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_apellido_paterno_id').val(renglon_apellido_paterno); //input text apellido paterno  (es un componente input por eso se ocupa val)
			$('#tb_apellido_materno_id').val(renglon_apellido_materno); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#tb_email_id').val(renglon_email); //input text email  (es un componente input por eso se ocupa val)
			$('#se_habilitado_id').val(renglon_habilitado); //1 si (true), 0 no (false).
			$('#se_estado_registro_id').val(renglon_estado_registro_id); //1 nuevo. inicializamos el valor

			$('#cb_edit_check_modal').prop("checked", false);
			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", true); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", true); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", true); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", true); //input text email habilitado (enable)
			$('#se_habilitado_id').prop("disabled", true);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", true);  //valor del estado registro habilitado (enable)

			
			//botones de la pagina modal -------------------------------------------------------------
			$("#btn_nuevo_ejecutar").hide(); //mostramos el boton de guardar nuevo registro
			$("#btn_editar_ejecutar").hide(); //ocultamos el boton de guardar editar registro
			$("#btn_duplicar_ejecutar").hide(); //mostramos el boton de guardar duplicado registro
			$("#btn_borrar_ejecutar").show(); //ocultamos el boton de borrar registro

			retornar_ventana_despues_de_error = false;
		
			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//mostramos la ventana modal

		});
	}


	// == BUSCAR ================================================================================================================

	//boton buscar -----------------------------------------	
	$( "#btn_buscar_base_datos_todos" ).click(function() {
					
			//guardamos los valores de busqueda
		busqueda_parametros[0] = null;
    	busqueda_parametros[1] = null;
    	busqueda_parametros[2] = null;
    	busqueda_parametros[3] = null;
    	busqueda_parametros[4] = null;
    	busqueda_parametros[5] = null; 
		busqueda_parametros[6] = null;
    	busqueda_parametros[7] = null;
    	busqueda_parametros[8] = null;
    	busqueda_parametros[9] = null; 
    	 
        ejecutarBuscarRegistrosAjax(null, null, null,null, null, null,null, null, null,null);
		
	});


	//boton buscar -----------------------------------------	
	$( "#btn_buscar_base_datos" ).click(function() {
			
			
			$("#modal_buscar .modal-title").html("Catálogo de Usuarios - Buscar Registro");//titulo de la ventana
			$('#modal_buscar div.modal-header').css("background-color",modal_header_color_fondo_buscar);  //color del encabezado de la ventana 
			$('#modal_buscar div.modal-header').css("color",modal_header_color_buscar);  //color del encabezado de la ventana 
			
			//etiqueta de mensaje de la ventana modal ----
			$('#modal_buscar_label_msg').parent().hide();

			
			/*
			$('#tb_nombre_id').val(""); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#ta_descripcion_id').val(""); //text area descripcion inicializado a espacio en blanco 
			$('#se_estado_registro_id').val(estado_registro_id_normal); //1 nuevo. inicializamos el valor

			//$('#cb_edit_check_modal').prop("checked", true);
			$('#tb_nombre_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#ta_descripcion_id').prop("disabled", false);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", false);  //valor del estado registro habilitado (enable)*/
			
			$('#modal_buscar').modal('show');//mostramos la ventana modal
	});



	//evento check para habilitar o deshabilitar los campos, para poder hacer busquedas ----------------------
	$("input[id^='cb_buscar_campo_']").click(function() {

		if($(this).is(":checked")){
         	$(this).parent().parent().find('input[type=text]').prop('disabled',false);
         	$(this).parent().parent().find('textarea').prop('disabled',false);
         	$(this).parent().parent().find('select').prop('disabled',false);
        }
        else{
         	$(this).parent().parent().find('input[type=text]').prop('disabled',true);
         	$(this).parent().parent().find('textarea').prop('disabled',true);
         	$(this).parent().parent().find('select').prop('disabled',true);
        }
        
	});

	//reiniciamos (limpiamos) los campos del formulario de busqueda ------
	$("#btn_buscar_reiniciar_campos").click(function() {
		$("input[id^='cb_buscar_campo_']").each(function( index ) {
			$(this).prop('checked',false);	
		    var cinput = $(this).parent().parent().find('input[type=text]');
		    cinput.prop('disabled',true);
		    cinput.val("");
         	var cta = $(this).parent().parent().find('textarea');
         	cta.prop('disabled',true);
         	cta.val("");
         	var cselect = $(this).parent().parent().find('select');
         	cselect.prop('disabled',true);
         	cselect.val(1);
		       
		});//end each
	});
	

	//bloqueamos y desbloqueamos los campos del formulario de busqueda ------
	var buscar_uncheck_checkboxes_valor = true;
	$("#btn_buscar_uncheck_checkboxes").click(function() {
		$("input[id^='cb_buscar_campo_']").each(function( index ) {
			
			$(this).prop('checked',buscar_uncheck_checkboxes_valor);	
		    var cinput = $(this).parent().parent().find('input[type=text]');
		    cinput.prop('disabled',!buscar_uncheck_checkboxes_valor);
         	var cta = $(this).parent().parent().find('textarea');
         	cta.prop('disabled',!buscar_uncheck_checkboxes_valor);
         	var cselect = $(this).parent().parent().find('select');
         	cselect.prop('disabled',!buscar_uncheck_checkboxes_valor);
		      
		});//end each
		//invertimos el valor
		buscar_uncheck_checkboxes_valor = !buscar_uncheck_checkboxes_valor;
	});
	




	

	//===BOTONES (EVENTOS) PARA MOSTRAR VENTANAS MODALES ==================================================================================================

	//boton nuevo -----------------------------------------	
	$( "#btn_mostrar_modal_nuevo_registro" ).click(function() {
			
			//$('#hidden_tipo_accion_id').val("crear");  //definimos el tipo de accion (crear o editar) lo guardanos en el campo oculto
			
			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Nuevo Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_nuevo);  //color del encabezado de la ventana (verder limon)
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_nuevo);  //color de las letras del encabezado de la ventana


			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().hide();

			//checkbox de edicion-------------------
			$('#cb_edit_check_modal').parent().hide();

			//ocultamos campos no editables -----------					
			$('#tb_id').parent().parent().hide(); //campo id (siempre desabilitado) --------
			$('#tb_fecha_registro_id').parent().parent().hide();//campo de fecha de registro show or hide---

			//-- CAMPOS -------------------------------------------------------------------------------------------------------
			$('#tb_fecha_registro_id').val(""); //input text fecha_registro (es un componente input por eso se ocupa val)
			$('#tb_rpe_id').val(""); //input text rpe inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_nombres_id').val(""); //input text nombres inicializado a espacio en blanco (es un componente input por eso se ocupa val)
			$('#tb_apellido_paterno_id').val(""); //input text apellido paterno  (es un componente input por eso se ocupa val)
			$('#tb_apellido_materno_id').val(""); //input text apellido materno  (es un componente input por eso se ocupa val)
			$('#tb_email_id').val(""); //input text email  (es un componente input por eso se ocupa val)
			$('#se_habilitado_id').val(1); //1 si (true), 0 no (false).
			$('#se_estado_registro_id').val(estado_registro_id_normal); //1 nuevo. inicializamos el valor*/

			$('#cb_edit_check_modal').prop("checked", false);
			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_email_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#se_habilitado_id').prop("disabled", false);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", false);  //valor del estado registro habilitado (enable)

			//botones de la pagina modal -------------------------------------------------------------
			$("#btn_nuevo_ejecutar").show(); //mostramos el boton de guardar nuevo registro
			$("#btn_editar_ejecutar").hide(); //ocultamos el boton de guardar editar registro
			$("#btn_duplicar_ejecutar").hide(); //mostramos el boton de guardar duplicado registro
			$("#btn_borrar_ejecutar").hide(); //ocultamos el boton de borrar registro

			retornar_ventana_despues_de_error = true;
			
			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//mostramos la ventana modal
	});



	//boton borrar por bloque -----------------------------------------	
	$( "#btn_mostrar_modal_borrar_bloque_registro" ).click(function() {
			//alert("btn_borrar_bloque");
			$("#modal_borrar .modal-title").html("Catálogo de Usuarios - Borar Registros Seleccionados");//titulo de la ventana
			$('#modal_borrar div.modal-header').css("background-color",modal_header_color_fondo_borrar);  //color del encabezado de la ventana
			$('#modal_borrar div.modal-header').css("color",modal_header_color_borrar);  //color de la letra del encabezado de la ventana

			$("#btn_borrar_bloque_ejecutar").show(); //inicializamnos el boton de borrar para que sea visible

			$("#modal_borrar .modal-body label").html("Estas seguro de borrar todos los registros seleccionados?");
	
			var lista="";
			var contador =0;
			$("input[id^='checkbox_reg_']").each(function( index ) {
			  	 	
		        if($(this).is(":checked")){
		            //var c_checkbox_id = $( this ).attr("id");
		            //var id = c_checkbox_id.substring(13);
		            //lista += id+", ";
		            contador ++;
		            var renglon_id = $(this).parent().parent().find("td:nth-child(2)").text();

		         	var renglon_rpe = $(this).parent().parent().find("td:nth-child(4)").text();
					var renglon_nombres = $(this).parent().parent().find("td:nth-child(5)").text();
		         	var renglon_apellido_paterno = $(this).parent().parent().find("td:nth-child(6)").text();
					var renglon_apellido_materno = $(this).parent().parent().find("td:nth-child(7)").text();
					var renglon_email      = $(this).parent().parent().find("td:nth-child(8)").text();
					var renglon_habilitado = $(this).parent().parent().find("td:nth-child(9)").text();
					var renglon_estado_registro = $(this).parent().parent().find("td:nth-child(10)").text();
		            //lista += renglon_indice + ".   " +renglon_nombre+"  (" + renglon_estado_registro + ")\n";
		            lista += "ID: "+renglon_id + "  -   (" + renglon_rpe + ") " + renglon_nombres + " " + renglon_apellido_paterno + " "+ renglon_apellido_materno + "\n";   
		        }
		       
			});

			if(contador==0){
				lista="No hay registros seleccionados con el checkbox.";
				$("#btn_borrar_bloque_ejecutar").hide(); //si no hay registros, se oculta el boron de borrar
			}
			$("#modal_borrar .modal-body textarea").text(lista);	

			retornar_ventana_despues_de_error = false;

			$('#modal_borrar').modal('show');//mostramos la ventana modal
	});

	
	//==============================================================================================================
	// BOTONES EN MODALES (EVENTOS) DE EJECUCION DENTRO DE LAS VENTANAS MODALES -----------------------------------------------------
	
	//boton crear nuevo registro -----------------------------------------	
	$( "#btn_nuevo_ejecutar" ).click(function() {
			
			//liberamos los popover para que no se dupliquen
			//liberarPopovers();

			var rpe 			 = $('#tb_rpe_id').val().trim();
		    var nombres          = $('#tb_nombres_id').val().trim();
		    var apellido_paterno = $('#tb_apellido_paterno_id').val().trim();
		    var apellido_materno = $('#tb_apellido_materno_id').val().trim();
		    var email            = $('#tb_email_id').val().trim();
		    var habilitado       = $('#se_habilitado_id').val().trim();
		    var estado_registro_id = $('#se_estado_registro_id').val().trim();

		    //validamos los campos ------
			if(validarCampos(rpe, nombres, apellido_paterno, email)){
		   		//realizamos la creacion o modificacion del registro
				ejecutarCrearEditarRegistroAjax("nuevo_registro", null, nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, estado_registro_id);
			
			}
	});


	//boton editar registro -----------------------------------------	
	$( "#btn_editar_ejecutar" ).click(function() {
			
			//liberamos los popover para que no se dupliquen
			//liberarPopovers();
		
			//lectura de campos --------------------------------------------------
			var id               = $('#hd_registro_id').val().trim(); //id del registros
		    var rpe 			 = $('#tb_rpe_id').val().trim();
		    var nombres          = $('#tb_nombres_id').val();
		    var apellido_paterno = $('#tb_apellido_paterno_id').val().trim();
		    var apellido_materno = $('#tb_apellido_materno_id').val().trim();
		    var email 			 = $('#tb_email_id').val().trim();
		    var habilitado       = $('#se_habilitado_id').val().trim();
		    var estado_registro_id = $('#se_estado_registro_id').val().trim();

			//validamos los campos ------
			if(validarCampos(rpe, nombres, apellido_paterno, email)){
		   		//realizamos la creacion o modificacion del registro
				ejecutarCrearEditarRegistroAjax("editar_registro", id, nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, estado_registro_id);
			
			}
			
	});

	//boton crear nuevo registro -----------------------------------------	
	$( "#btn_duplicar_ejecutar" ).click(function() {
		
			//liberamos los popover para que no se dupliquen
			//liberarPopovers();
		
			//lectura de campos --------------------------------------------------
		    var rpe 			 = $('#tb_rpe_id').val().trim();
		    var nombres          = $('#tb_nombres_id').val().trim();
		    var apellido_paterno = $('#tb_apellido_paterno_id').val().trim();
		    var apellido_materno = $('#tb_apellido_materno_id').val().trim();
		    var email            = $('#tb_email_id').val().trim();
		    var habilitado       = $('#se_habilitado_id').val().trim();
		    var estado_registro_id = $('#se_estado_registro_id').val().trim();

			//validamos los campos ------
			if(validarCampos(rpe, nombres, apellido_paterno, email)){
		   		//realizamos la creacion o modificacion del registro
				ejecutarCrearEditarRegistroAjax("nuevo_registro", null, nombres, apellido_paterno, apellido_materno, rpe, email, habilitado, estado_registro_id);
			
			}
	});


	//boton borrar registros seleccionadps-----------------------------------------	
	$( "#btn_borrar_ejecutar" ).click(function() {
		var lista=[]; //creamos el arreglo que va a guardar los id 
		//lectura de campos --------------------------------------------------
		var renglon_id = $('#hd_registro_id').val(); //id del registros
		lista[0]= renglon_id; //asignamos el id del registro para borrar
		//ejecutamos la funcion de borrar regisgtros y le pasamos la lista de id para borrar
		ejecutarBorrarRegistrosAjax(lista);
	});


	//boton borrar registros seleccionadps-----------------------------------------	
	$( "#btn_borrar_bloque_ejecutar" ).click(function() {
		var lista=[]; //creamos el arreglo que va a guardar los id 
		//listamos los checkbox seleccionados
		$("input[id^='checkbox_reg_']").each(function( index ) {
		  	 	
	        if($(this).is(":checked")){
	            var c_checkbox_id = $( this ).attr("id");
	            var id = c_checkbox_id.substring(13);
	            //lista += "'"+id+"',";
	            lista.push(id);
	        }
	       
		});

		//ejecutamos la funcion de borrar regisgtros y le pasamos la lista de id para borrar
		ejecutarBorrarRegistrosAjax(lista);		
	});



	//boton borrar registros seleccionadps-----------------------------------------	
	$( "#btn_buscar_ejecutar" ).click(function() {

		//lectura de campos --------------------------------------------------
		var id = $('#tb_buscar_campo_id').val().trim(); //id del registros
		var rpe = $('#tb_buscar_campo_rpe_id').val().trim(); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
		var nombres = $('#tb_buscar_campo_nombres_id').val().trim(); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
		var apellido_paterno = $('#tb_buscar_campo_apellido_paterno_id').val().trim(); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
		var apellido_materno = $('#tb_buscar_campo_apellido_materno_id').val().trim(); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
		var email = $('#tb_buscar_campo_email_id').val().trim(); //input text nombre inicializado a espacio en blanco (es un componente input por eso se ocupa val)
		var habilitado = $('#se_buscar_campo_habilitado_id').val().trim(); //text area descripcion inicializado a espacio en blanco (es un componente que finciona con contenido html)
		var fecha_registro_inicial = $('#tb_buscar_campo_fecha_registro_inicial_id').val().trim();
		var fecha_registro_final = $('#tb_buscar_campo_fecha_registro_final_id').val().trim();
		var estado_registro_id = $('#se_buscar_campo_estado_registro_id').val().trim(); //1 nuevo
		var cb_buscar_campo_id_is_click               = $('#cb_buscar_campo_id').is(":checked");
		var cb_buscar_campo_fecha_registro_is_click   = $('#cb_buscar_campo_fecha_registro').is(":checked");
		var cb_buscar_campo_rpe_is_click              = $('#cb_buscar_campo_rpe').is(":checked");
		var cb_buscar_campo_nombres_is_click          = $('#cb_buscar_campo_nombres').is(":checked");
		var cb_buscar_campo_apellido_paterno_is_click = $('#cb_buscar_campo_apellido_paterno').is(":checked");
		var cb_buscar_campo_apellido_materno_is_click = $('#cb_buscar_campo_apellido_materno').is(":checked");
		var cb_buscar_campo_email_is_click            = $('#cb_buscar_campo_email').is(":checked");
		var cb_buscar_campo_habilitado_is_click       = $('#cb_buscar_campo_habilitado').is(":checked");
		var cb_buscar_campo_estado_registro_is_click  = $('#cb_buscar_campo_estado_registro').is(":checked");

		//validamos que los checkbox sean true sino sus valores respectivos seran nulos para la busqueda
		if(!cb_buscar_campo_id_is_click){
			id=null;
		}

		if(!cb_buscar_campo_fecha_registro_is_click){
			fecha_registro_inicial = null;
			fecha_registro_final   = null;
		}

		if(!cb_buscar_campo_rpe_is_click){
			rpe=null;
		}

		if(!cb_buscar_campo_nombres_is_click){
			nombres=null;
		}

		if(!cb_buscar_campo_apellido_paterno_is_click){
			apellido_paterno=null;
		}

		if(!cb_buscar_campo_apellido_materno_is_click){
			apellido_materno=null;
		}

		if(!cb_buscar_campo_email_is_click){
			email=null;
		}

		if(!cb_buscar_campo_habilitado_is_click){
			habilitado=null;
		}
		
		if(!cb_buscar_campo_estado_registro_is_click){
			estado_registro_id=null;
		}

		//guardamos los valores de busqueda -------------------------
    	busqueda_parametros[0] = id;
    	busqueda_parametros[1] = rpe;
    	busqueda_parametros[2] = nombres;
    	busqueda_parametros[3] = apellido_paterno;
    	busqueda_parametros[4] = apellido_materno;
    	busqueda_parametros[5] = email;
    	busqueda_parametros[6] = habilitado;
    	busqueda_parametros[7] = fecha_registro_inicial;
    	busqueda_parametros[8] = fecha_registro_final;
    	busqueda_parametros[9] = estado_registro_id; 
    	 
        ejecutarBuscarRegistrosAjax(id, rpe, nombres, apellido_paterno, apellido_materno, email, habilitado, fecha_registro_inicial, fecha_registro_final, estado_registro_id);
		
	});




	//=== POPOVERS ==============================================================================================================================

	var definirPopovers = function(){

		 
		$('[data-toggle="popover"]').popover({
			//html: true, o en el elemento se pone el atributo data-html="true" 
		    container: 'body',
		    trigger : 'hover', //<--- you need a trigger other than manual
		    delay: { 
		       show: "500", 
		       hide: "100"
		    }
		  });

		 
		 //popover de buscar registros -------
		 $('#btn_buscar_base_datos_todos').attr('data-original-title', popover_msg.title_buscar_base_datos_todos);
     	 $('#btn_buscar_base_datos_todos').attr("data-content", popover_msg.data_buscar_base_datos_todos);

     	  $('#btn_buscar_base_datos').attr('data-original-title', popover_msg.title_buscar_base_datos);
     	 $('#btn_buscar_base_datos').attr("data-content", popover_msg.data_buscar_base_datos);


     	 $('#btn_buscar_uncheck_checkboxes').attr('data-original-title', popover_msg.title_buscar_uncheck_checkboxes);
     	 $('#btn_buscar_uncheck_checkboxes').attr("data-content", popover_msg.data_buscar_uncheck_checkboxes);

     	 $('#btn_buscar_reiniciar_campos').attr('data-original-title', popover_msg.title_buscar_reiniciar_campos);
     	 $('#btn_buscar_reiniciar_campos').attr("data-content", popover_msg.data_buscar_reiniciar_campos);


     	 //popover de limpiar filtros -------
		 $('.btn_limpiar_filtros').attr('data-original-title', popover_msg.title_limpiar_filtros);
     	 $('.btn_limpiar_filtros').attr("data-content", popover_msg.data_limpiar_filtros);

     	 //popover de mostrar campos default -------
		 $('.btn_mostrar_tabla_default').attr('data-original-title', popover_msg.title_mostrar_tabla_default);
     	 $('.btn_mostrar_tabla_default').attr("data-content", popover_msg.data_mostrar_tabla_default);

     	 //popover de mostrar campos_seleccionados -------
		 $('.btn_mostrar_campos_seleccionados').attr('data-original-title', popover_msg.title_mostrar_campos_seleccionados);
     	 $('.btn_mostrar_campos_seleccionados').attr("data-content", popover_msg.data_mostrar_campos_seleccionados);

		 //popover de mostrar todos los campos -------
		 $('.btn_mostrar_todos_campos').attr('data-original-title', popover_msg.title_mostrar_todos_campos);
     	 $('.btn_mostrar_todos_campos').attr("data-content", popover_msg.data_mostrar_todos_campos);

     	 //popover de seleccionar_campos_para_mostrar -------
		 $('.btn_seleccionar_campos_para_mostrar').attr('data-original-title', popover_msg.title_seleccionar_campos_para_mostrar);
     	 $('.btn_seleccionar_campos_para_mostrar').attr("data-content", popover_msg.data_seleccionar_campos_para_mostrar);

     	 //popover de mostrar_modal_nuevo_registro -------
     	 $('#btn_mostrar_modal_nuevo_registro').attr('data-original-title', popover_msg.title_mostrar_modal_nuevo_registro);
     	 $('#btn_mostrar_modal_nuevo_registro').attr("data-content", popover_msg.data_mostrar_modal_nuevo_registro);

     	 //popover de mostrar_modal_nuevo_registro -------
     	 $('#btn_mostrar_modal_editar_bloque_registros').attr('data-original-title', popover_msg.title_mostrar_modal_editar_bloque_registros);
     	 $('#btn_mostrar_modal_editar_bloque_registros').attr("data-content", popover_msg.data_mostrar_modal_editar_bloque_registros);

     	 //popover de mostrar_modal_nuevo_registro -------
     	 $('#btn_mostrar_modal_borrar_bloque_registro').attr('data-original-title', popover_msg.title_mostrar_modal_borrar_bloque_registro);
     	 $('#btn_mostrar_modal_borrar_bloque_registro').attr("data-content", popover_msg.data_mostrar_modal_borrar_bloque_registro);

     	 //botones de los registros -----------------------------------------
     	 
     	 //duplicar registro -------
     	 $('.btn_duplicar_cascada').attr('data-original-title', popover_msg.title_duplicar_registro);
     	 $('.btn_duplicar_cascada').attr("data-content", popover_msg.data_duplicar_registro);

     	 $('.btn_duplicar_actualizar').attr('data-original-title', popover_msg.title_duplicar_registro);
     	 $('.btn_duplicar_actualizar').attr("data-content", popover_msg.data_duplicar_registro);

     	 //duplicar registro -------
     	 $('.btn_editar').attr('data-original-title', popover_msg.title_editar_registro);
     	 $('.btn_editar').attr("data-content", popover_msg.data_editar_registro);

     	 //borrar registro -------
     	 $('.btn_borrar').attr('data-original-title', popover_msg.title_borrar_registro);
     	 $('.btn_borrar').attr("data-content", popover_msg.data_borrar_registro);


     	 //botones del pager -----------------------------------------------
     	 $('#bt_pager_first').attr('data-original-title', popover_msg.title_bt_pager_first);
     	 $('#bt_pager_first').attr("data-content", popover_msg.data_bt_pager_first);

     	 $('#bt_pager_prev').attr('data-original-title', popover_msg.title_bt_pager_prev);
     	 $('#bt_pager_prev').attr("data-content", popover_msg.data_bt_pager_prev);

     	 $('#bt_pager_next').attr('data-original-title', popover_msg.title_bt_pager_next);
     	 $('#bt_pager_next').attr("data-content", popover_msg.data_bt_pager_next);

     	 $('#se_num_elem').attr('data-original-title', popover_msg.title_se_num_elem);
     	 $('#se_num_elem').attr("data-content", popover_msg.data_se_num_elem);

     	 $('#se_num_pag').attr('data-original-title', popover_msg.title_se_num_pag);
     	 $('#se_num_pag').attr("data-content", popover_msg.data_se_num_pag);


     	  $('#checkbox_all_registers').attr('data-original-title', popover_msg.title_checkbox_all);
     	 $('#checkbox_all_registers').attr("data-content", popover_msg.data_checkbox_all);

     	 //asignacion a los filtros ----------------------------------------------------------------------------
     	 $('#filtro_tabla_1').attr('data-original-title', popover_msg.title_filtro_numerico);
     	 $('#filtro_tabla_1').attr("data-content", popover_msg.data_filtro_numerico);

     	 $('#filtro_tabla_2').attr('data-original-title', popover_msg.title_filtro_numerico);
     	 $('#filtro_tabla_2').attr("data-content", popover_msg.data_filtro_numerico);

     	 $('#filtro_tabla_3').attr('data-original-title', popover_msg.title_filtro_fecha);
     	 $('#filtro_tabla_3').attr("data-content", popover_msg.data_filtro_fecha);

     	 $('#filtro_tabla_4').attr('data-original-title', popover_msg.title_filtro_alfanumerico);
     	 $('#filtro_tabla_4').attr("data-content", popover_msg.data_filtro_alfanumerico);

     	 $('#filtro_tabla_5').attr('data-original-title', popover_msg.title_filtro_alfanumerico);
     	 $('#filtro_tabla_5').attr("data-content", popover_msg.data_filtro_alfanumerico);

     	 $('#filtro_tabla_6').attr('data-original-title', popover_msg.title_filtro_alfanumerico);
     	 $('#filtro_tabla_6').attr("data-content", popover_msg.data_filtro_alfanumerico);

     	 $('#filtro_tabla_7').attr('data-original-title', popover_msg.title_filtro_alfanumerico);
     	 $('#filtro_tabla_7').attr("data-content", popover_msg.data_filtro_alfanumerico);

     	 $('#filtro_tabla_8').attr('data-original-title', popover_msg.title_filtro_alfanumerico);
     	 $('#filtro_tabla_8').attr("data-content", popover_msg.data_filtro_alfanumerico);

	}


	var liberarPopovers = function(){
		$('[data-toggle="popover"]').popover('dispose');
	}




	//=== CHECKBOX TABLA BUSQUEDA==============================================================================================================================

	//evento check para habilitar o deshabilitar popovers------
	$('#checkbox_all_registers').click(function() {
        var all_is_checked = $(this).is(":checked"); //obtenemos el estado del checkbox que selecciona o deselecciona todos
        $("input[id^='checkbox_reg_']").each(function( index ) {//recorrecmos cada checkbox de  registro
	  	 	var ccb_display = $(this).parent().parent().css("display"); //ver el estado de display del registro, para ver si se esta mostrando	
	  	 	//si se esta mostrando renglon (tr) esto es que es diferente de  none
	  	 	if(ccb_display != 'none') //si el registro se muestra, entonces lo checamos o deschecamos segun el checkbox de toda la seleccion
	  	 		$(this).prop("checked", all_is_checked);
		});
	});



	//checkbox de la ventana modal (para editar) ---------------
	$('#cb_edit_check_modal').click(function() {
		if( $(this).is(":checked") ){
			$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Editar Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_editar);  //color del encabezado de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_editar);  //color de las letras del encabezado de la ventana

			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", false); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", false); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", false); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", false); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", false); //input text email habilitado (enable)
			$('#se_habilitado_id').prop("disabled", false);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", false);  //valor del estado registro habilitado (enable)

			$("#btn_editar_ejecutar").show(); //mostramos el boton de editar registro				      
        }
        else{
        	$("#modal_nuevo_edit_duplicar_borrar .modal-title").html("Catálogo de Usuarios - Ver Registro");//titulo de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("background-color",modal_header_color_fondo_ver);  //color del encabezado de la ventana
			$('#modal_nuevo_edit_duplicar_borrar div.modal-header').css("color",modal_header_color_ver);  //color de las letras del encabezado de la ventana

			$('#tb_fecha_registro_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_rpe_id').prop("disabled", true); //input text nombre habilitado (enable)
			$('#tb_nombres_id').prop("disabled", true); //input text nombres habilitado (enable)
			$('#tb_apellido_paterno_id').prop("disabled", true); //input text apellido paterno habilitado (enable)
			$('#tb_apellido_materno_id').prop("disabled", true); //input text apellido materno habilitado (enable)
			$('#tb_email_id').prop("disabled", true); //input text email habilitado (enable)
			$('#se_habilitado_id').prop("disabled", true);  //text area descripcion habilitado (enable) 
			$('#se_estado_registro_id').prop("disabled", true);  //valor del estado registro habilitado (enable)

			$("#btn_editar_ejecutar").hide(); //ocultamos el boton de editar registro
        }
	});


	//===MOSTRAR COLUMNAS  TODAS O SOLO SELECCIONADAS ==================================================================================================

	//funcion qe muestra todos los campos ------------------------------------
	var ajustarListaCamposSegunRol = function(){
			//campos que solo ve el administrador-------------------
			if(rol!=ROL_ADMIN){ //si el rol no es admin ocultamos los campos
				lista_campos_mostrados_habilitados[1] = false; //id de la base de datos
				lista_campos_mostrados_habilitados[2] = false; //fecha de registro		
			}
	}

	//funcion qe muestra todos los campos ------------------------------------
	var mostrarTodosCampos = function(){

		for(var i=0 ; i<lista_campos_mostrados.length ; i++){
			var cnum_campo = i+1;
			//validamos si es un campo valido segun el perfil
			if(lista_campos_mostrados_habilitados[i]){
				
				$( "#my_table_sorter tr th:nth-child("+cnum_campo+")" ).css("display","table-cell");
				$( "#my_table_sorter tr td:nth-child("+cnum_campo+")" ).css("display","table-cell");
			}
			else{//ocultamos el campo si no es valido
				$( "#my_table_sorter tr th:nth-child("+cnum_campo+")" ).css("display","none");
				$( "#my_table_sorter tr td:nth-child("+cnum_campo+")" ).css("display","none");
			}
		}

		
	}

	//funcion qe muestra todos los campos ------------------------------------
	var mostrarCamposSeleccionados = function(){

		for(var i=0 ; i<lista_campos_mostrados.length ; i++){
			var cnum_campo = i+1;
			//si el campo esta marcado y ademas es un campo valido
			if(lista_campos_mostrados[i] && lista_campos_mostrados_habilitados[i]){ //mostramos los con bandera true
				$( "#my_table_sorter tr th:nth-child("+cnum_campo+")" ).css("display","table-cell");
				$( "#my_table_sorter tr td:nth-child("+cnum_campo+")" ).css("display","table-cell");
			}
			else{//ocultamos los con bandera true
				$( "#my_table_sorter tr th:nth-child("+cnum_campo+")" ).css("display","none");
				$( "#my_table_sorter tr td:nth-child("+cnum_campo+")" ).css("display","none");
			}
		}	
	}

	//boton para mostrar todos los campos ---------------------------------
	$( ".btn_mostrar_todos_campos" ).click(function() {

		mostrar_todas_columnas = true;
		mostrarTodosCampos();
		setListaCamposSeleccionadosModal();

		//alterna la visualizacion de los botones -----------
		$( ".btn_mostrar_todos_campos" ).css("display","none");
		$( ".btn_mostrar_campos_seleccionados" ).css("display","");
	});


	//boton para mostrar campos seleccionados ---------------------------------
	$( ".btn_mostrar_campos_seleccionados" ).click(function() {
		
		mostrar_todas_columnas = false;
		mostrarCamposSeleccionados();
		setListaCamposSeleccionadosModal();
		//alterna la visualizacion de los botones -----------
		$( ".btn_mostrar_todos_campos" ).css("display","");
		$( ".btn_mostrar_campos_seleccionados" ).css("display","none");
	});

	//definir estado de las columnas -----------------------------------------
	var definirEstadoMostrarColumnas = function(){
		if(	mostrar_todas_columnas ){
			mostrarTodosCampos();
		}
		else{
			mostrarCamposSeleccionados();
		}
	}	

	//===MOSTRAR COLUMNAS POR DEFAULT ==================================================================================================
	//boton para mostrar todos los campos ---------------------------------
	$( ".btn_mostrar_tabla_default" ).click(function() {

		//copiamos las posiciones en el arreglo de campos mostrados lista_campos_mostrados con el valor 
		//del arreglo defaul lista_campos_mostrados_default
		for(var i=0 ; i<lista_campos_mostrados_default.length ; i++) {
   			lista_campos_mostrados[i] = lista_campos_mostrados_default[i];
		}
		//alert(">> "+lista_campos_mostrados);
		setListaCamposSeleccionadosModal();
		mostrarCamposSeleccionados();

		$(".btn_mostrar_todos_campos").show();
        $(".btn_mostrar_campos_seleccionados").hide();
        $(".btn_mostrar_campos_seleccionados").prop("disabled", false);
	});


	//===SELECCION DE MOSTRAR COLUMNAS DE LA TABLA ==================================================================================================

	//inicializacion de campos segun la lista de mostrados
	var setListaCamposSeleccionadosModal = function(){
	  //recorremos todos los campos de la ventana modal de seleccion de campos para visualizar
	  //segun el valor del arreglo los pondremos en chek o no
	  $("input[id^='cb_modal_seleccion_campo_']").each(function(){
	  	 var cnum_campo = $(this).attr('my_campo_tabla');
	  	 var cnum_campo_en_arreglo = cnum_campo-1; 
	  	 $(this).prop("checked", lista_campos_mostrados[cnum_campo_en_arreglo]);	
	  });
	}

	// BOTON------------------------------------------------------------------------------
	//boton para mostrar la modal con todos los campos 
	$( ".btn_seleccionar_campos_para_mostrar" ).click(function() {

		//solo al perfil admin le muestra el id y la fecha del registro
		//si el rol es 1. admin
		if(rol==ROL_ADMIN){				
			$('#cb_modal_seleccion_campo_id').parent().show();
			$('#cb_modal_seleccion_campo_fecha_registro').parent().show();
		}
		else{
			$('#cb_modal_seleccion_campo_id').parent().hide();
			$('#cb_modal_seleccion_campo_fecha_registro').parent().hide();
		}

		$("#modal_seleccion_campos_visibles").modal('show');
	});



	//CHECKBOX TODOS--------------------------------------------------------------------------
	//evento check para habilitar o deshabilitar los campos mostrados
	$('#cb_modal_seleccion_campos_todos').click(function() {
		var valor_seleccion_todos = false;
		if($(this).is(":checked")){
            valor_seleccion_todos = true;
            $(".btn_mostrar_todos_campos").hide();
            $(".btn_mostrar_todos_campos").prop("disabled", false); //desabilitamos el boton
            $(".btn_mostrar_campos_seleccionados").show();
            $(".btn_mostrar_campos_seleccionados").prop("disabled", true); //desabilitamos el boton
        }
        else{
            valor_seleccion_todos = false;
            $(".btn_mostrar_todos_campos").show();
            $(".btn_mostrar_todos_campos").prop("disabled", false);
            $(".btn_mostrar_campos_seleccionados").hide();
            $(".btn_mostrar_campos_seleccionados").prop("disabled", false);
        }

        //recorremos la lista de campos, para asignar el mismo valor de check a todos
        for(var i=0 ; i<lista_campos_mostrados.length ; i++){
        	lista_campos_mostrados[i] = valor_seleccion_todos;
		}
		//para garantizar que al menos el defaul queda activo
		lista_campos_mostrados[campo_mostrar_minimo_default] = true;

        setListaCamposSeleccionadosModal();
        mostrarCamposSeleccionados();
	});

	//CHECKBOX CADA COLUMNA--------------------------------------------------------------------------
	//evento check para habilitar o deshabilitar cada uno d elos campos
	$("input[id^='cb_modal_seleccion_campo_']").click(function() {
		var cid = $(this).attr('id');
        var cnum_campo = $(this).attr('my_campo_tabla');
        var cnum_campo_en_arreglo = cnum_campo-1; 
		if($(this).is(":checked")){
            lista_campos_mostrados[cnum_campo_en_arreglo]=true; //actualizamos el estado del campo en la lista de campos mostrados
        }
        else{
            //con un solo elemento que no sea checado, la opcion de seleccionar todos se deshabilita
            $('#cb_modal_seleccion_campos_todos').prop("checked", false);

			lista_campos_mostrados[cnum_campo_en_arreglo]=false; //actualizamos el estado del campo en la lista de campos mostrados
        }


        //validamos que en cada check se verifique que al menos queda uno activado
        var todos_activados = true;
        var todos_desactivados = true;
        //recorremos la lista de campos
        for(var i=0 ; i<lista_campos_mostrados.length ; i++){
        	//solo se ejecuta para campos validos para el perfil
        	if(lista_campos_mostrados_habilitados[i]){
	        	//validamos que almenos un checkbox de la lista de mostrados sea verdadero
	        	//si algun checkbox es true (cheked) entonces no todos estan desactivados
	        	if(lista_campos_mostrados[i]){
	        		todos_desactivados = false;
	        	}
	        	//validamos que almenos un checkbox de la lista de mostrados sea falso
	        	//si algun checkbox es falso (uncheked) entonces no todos estan activados
	        	else{
	        		todos_activados = false;
	        	}	
	        }
		}
		
		//si todos estan desactivados, activamos un valor default para que haya que mostrar
		if(todos_desactivados){
				lista_campos_mostrados[campo_mostrar_minimo_default] = true;
		}

		//si todos estan selecionado, tambien habilitamos el checkbox de todos
		//ademas de mostrar el boton de mostrar solo seleccionados como deshabilitado
		if(todos_activados){
			$('#cb_modal_seleccion_campos_todos').prop("checked", true);

			$(".btn_mostrar_todos_campos").hide();
            //$(".btn_mostrar_todos_campos").prop("disabled", false); //desabilitamos el boton
            $(".btn_mostrar_campos_seleccionados").show();
            $(".btn_mostrar_campos_seleccionados").prop("disabled", true); //desabilitamos el boton
		}
		//ademas de mostrar el boton de mostrar campos seleccionados como habilitado
		else{
            $(".btn_mostrar_todos_campos").show();
            //$(".btn_mostrar_todos_campos").prop("disabled", false);
            $(".btn_mostrar_campos_seleccionados").hide();
            $(".btn_mostrar_campos_seleccionados").prop("disabled", false);
		}

        //alert("id :: "+cid+" - cnum_campo:"+cnum_campo);
        setListaCamposSeleccionadosModal();
		mostrarCamposSeleccionados();
	});




	
	//===============================================================================================================================
	//=== DATEPICKER ==================================================================================================

	 $.datepicker.regional['es'] = {
		 closeText: 'Cerrar',
		 prevText: '< Ant',
		 nextText: 'Sig >',
		 currentText: 'Hoy',
		 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		 dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		 weekHeader: 'Sm',
		 dateFormat: 'yy-mm-dd',
		 firstDay: 1,
		 isRTL: false,
		 showMonthAfterYear: false,
		 yearSuffix: ''
		 };
	

	 $( "#tb_buscar_campo_fecha_registro_inicial_id" ).datepicker({
      changeMonth: true,
      changeYear: true,
       onSelect: function(date) {
            ajustaRangoFechasIni(date);
        },
    })
	.datepicker( "option", "dateFormat", "yy-mm-dd" )
	.datepicker( "option", $.datepicker.regional['es'] );


	 $( "#tb_buscar_campo_fecha_registro_final_id" ).datepicker({
      changeMonth: true,
      changeYear: true,
       onSelect: function(date) {
            ajustaRangoFechasFin(date);
        },
    })
	.datepicker( "option", "dateFormat", "yy-mm-dd" )
	.datepicker( "option", $.datepicker.regional['es'] );

	var ajustaRangoFechasIni = function(date){
		//si la fecha final esta en blanco entonces asigna esta misma fecha
		if( $( "#tb_buscar_campo_fecha_registro_final_id" ).val() == "" ) 
				$( "#tb_buscar_campo_fecha_registro_final_id" ).val(date);
		var fecha = new Date(date);
		fecha.setDate(fecha.getDate() + 1);
		$( "#tb_buscar_campo_fecha_registro_final_id" ).datepicker( "option", "minDate", fecha );
	}

	var ajustaRangoFechasFin = function(date){
		//si la fecha inicial esta en blanco entonces asigna esta misma fecha
		if( $( "#tb_buscar_campo_fecha_registro_inicial_id" ).val() == "" ) 
				$( "#tb_buscar_campo_fecha_registro_inicial_id" ).val(date);
		var fecha = new Date(date);
		fecha.setDate(fecha.getDate() + 1);
		$( "#tb_buscar_campo_fecha_registro_inicial_id" ).datepicker( "option", "maxDate", fecha );
		
	}
	 
	
	

	//===============================================================================================================================
	//=== PINTAR COLORES REGISTROS ==================================================================================================
	var ajustarEstadoRegistros = function(){

		  $("#my_table_sorter tr").each(function(){

		  		//verificamos el estado de registro en la columna 10
			    var estado_registro_id = $(this).find("td:nth-child("+columna_estado_registros+")").attr("estado_registro_id");
			    
			    if(estado_registro_id == estado_registro_id_normal){
			    	$(this).find('[id^="reg_div_id_').addClass("my_link_table_normal mytablelink"); //estilo para el link del nombre
			    	$(this).find("td:nth-child("+columna_estado_registros+")").find("div").addClass("my_link_table_normal"); //estilo para el link de estado registros
			    }
			    else if(estado_registro_id == estado_registro_id_pendiente){
			    	$(this).find('[id^="reg_div_id_').addClass("my_link_table_pendiente mytablelink"); //estilo para el link del nombre
			    	$(this).find("td:nth-child("+columna_estado_registros+")").find("div").addClass("my_link_table_pendiente"); //estilo para el link de estado registros
			    }
			    else if(estado_registro_id == estado_registro_id_revision){			    	
			    	$(this).find('[id^="reg_div_id_').addClass("my_link_table_revision mytablelink"); //estilo para el link del nombre
			    	$(this).find("td:nth-child("+columna_estado_registros+")").find("div").addClass("my_link_table_revision"); //estilo para el link de estado registros
			    }
			    else if( estado_registro_id == estado_registro_id_duplicado){
			    	$(this).find("td").addClass("my_reg_duplicado");
			    	$(this).find('[id^="btn_duplicar_cascada_').prop("disabled", true); //Selector [name^=”value”]
			    	$(this).find('[id^="reg_div_id_').addClass("my_link_table_duplicado mytablelink"); //estilo para el link del nombre
			    	$(this).find("td:nth-child("+columna_estado_registros+")").find("div").addClass("my_link_table_duplicado"); //estilo para el link de estado registros
			    }
			    else if( estado_registro_id == estado_registro_id_duplicado_en_cascada){
			    	$(this).find("td").addClass("my_reg_duplicado");
			    	$(this).find('[id^="btn_duplicar_cascada_').prop("disabled", true); //Selector [name^=”value”]
			    	$(this).find('[id^="reg_div_id_').addClass("my_link_table_duplicado_en_cascada mytablelink"); //estilo para el link del nombre
			    	$(this).find("td:nth-child("+columna_estado_registros+")").find("div").addClass("my_link_table_duplicado_en_cascada"); //estilo para el link de estado registros
			    }

		    //alert($(this).html());
		  });
	} 

	//=== CORRECCION DE ERRORES ==============================================================================================================

	var borrarExcesoTablesorterResizableContainer = function(){
		 var contador =0;
		 //si exister mas de 1 tablesorter-resizable-container los removemos 
		 $(".tablesorter-resizable-container").each(function(){
		 	if(contador>0){
		 		$(this).remove();
		 	}
		 	contador++;
		 });
		 //alert("tablesorter-resizable-container: "+contador);
	}

	var pintarBotonesExtraTablesorter = function(){


		var boton_limpiar_filtros = '<div>';
		boton_limpiar_filtros += '<button type="button" class="btn my_btn btn-light btn_limpiar_filtros" data-toggle="popover" title="" data-placement="left" data-content="" onclick="$(\'table\').trigger(\'filterReset\');">';
		boton_limpiar_filtros +='<img class="icons24x24" src="images/icons/32x32/draw_eraser.png" /></button></div>';
	
		
		 var td_zona_filtros_acciones = $(".tablesorter-filter-row ").find("td:nth-child("+ columna_botones_acciones+")");
		 td_zona_filtros_acciones.html(boton_limpiar_filtros);
		 var div_zona_filtros_acciones = td_zona_filtros_acciones.find('div');
		 div_zona_filtros_acciones.css("text-align","right");
		 div_zona_filtros_acciones.css("padding","2px 2px 2px 2px");
	}



	//pintar popover en los filtros del table ----------------------------------------------------------------
	var pintarPopoversSobreFiltrosTabla = function(){
		//definimos attributos a los filtros para que funcionen los popovers
		//no necesariamente van a definirse popovers a cada filtro, pero si se egregamos atributos a todos
		 for(var i=1 ; i<= numero_filtros_tabla; i++ ){
			 var c_filtro_tabla = $(".tablesorter-filter-row ").find("td:nth-child("+i+")");
			 c_filtro_tabla.attr("data-toggle","popover");
			 c_filtro_tabla.attr("data-placement","left");
			 c_filtro_tabla.attr("data-html","true");
			 c_filtro_tabla.attr("id","filtro_tabla_"+i);
		}	 
	}
	
	//=== FUNCIONES MODAL DE MENSAJES DE ERROR ======================================================================================================
	
	var showErrorMessages = function(error_ids, error_code, error_msg_raw, error_msg_interpretado){
		 	$("#modal_mensajes_error .modal-title").html("ERROR");//titulo de la ventana
			$('#modal_mensajes_error div.modal-header').css("background-color",modal_error_header_color_fondo_borrar);  //color del encabezado de la ventana
			$('#modal_mensajes_error div.modal-header').css("color",modal_error_header_color_borrar);  //color de las letras del encabezado de la ventana

			
			var full_error_msg = "ids: "+error_ids+"\r\n"+"code: " + error_code +"\r\n"+ error_msg_raw;
			$('#modal_mensajes_error_msg_interpretado').html(error_msg_interpretado);
			$('#modal_mensajes_error_msg_raw').html(full_error_msg);

			//poner checkbox de codigo crudo (original) deseleccionado
			$('#modal_mensajes_error_cb_mostrar_msg_raw').prop("checked",false);
			//ocultamos mensaje original
			$('#modal_mensajes_error_msg_raw').hide();
			//mostrar ventana error
			$("#modal_mensajes_error").modal("show");
	}

	
	//evento check para habilitar o deshabilitar el textarea del mensaje del error del sistema
	$('#modal_mensajes_error_cb_mostrar_msg_raw').click(function() {
		if($(this).is(":checked")){
           $('#modal_mensajes_error_msg_raw').show();
        }
        else{
            $('#modal_mensajes_error_msg_raw').hide();
        }
	});

	var initErrorMsg = function(){
		$('#modal_mensajes_error_msg_raw').hide();
	} 




	//evento check para habilitar o deshabilitar el textarea del mensaje del error del sistema
	$('#modal_mensajes_error_btn_cerrar_id').click(function() {
		$('#modal_mensajes_error').modal("hide");
		if(retornar_ventana_despues_de_error){	
			$('#modal_nuevo_edit_duplicar_borrar').modal('show');//oculta la ventana modal
		}
	});	


	//=== VALIDACION DE CAMPOS EN VENTANAS MODALES Y MENSAJES DE ERROR ======================================================================================================
	var validarCampos = function(rpe, nombres, apellido_paterno, email){
		if(rpe == null || rpe == ""){
			//colocamos el texto del aviso en la modal ------	
			$("#modal_label_msg").html("El campo RPE no puede ser vacío.");
			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().show();
			return false;
		}
		else if(rpe.length!=5){
			//colocamos el texto del aviso en la modal ------	
			$("#modal_label_msg").html("La longitud del valor del campo RPE no es valida.");
			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().show();
			return false;
		}
		else if(nombres == null || nombres == ""){
			//colocamos el texto del aviso en la modal ------	
			$("#modal_label_msg").html("El campo nombres no puede ser vacío.");
			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().show();
			return false;
		}
		else if(apellido_paterno == null || apellido_paterno == ""){
			//colocamos el texto del aviso en la modal ------	
			$("#modal_label_msg").html("El campo apellido paterno no puede ser vacío.");
			//etiqueta de mensaje de la ventana modal ----
			$('#modal_label_msg').parent().show();
			return false;
		}
		else if( email != null && email != ""){ //si existe email

			//si existe email validamos el formato correcto
			if(!validarEmail(email) ){
			   //colocamos el texto del aviso en la modal ------	
				$("#modal_label_msg").html("El email no tiene un formato valido.");
				//etiqueta de mensaje de la ventana modal ----
				$('#modal_label_msg').parent().show();
				return false;
			}	
		}

		return true;
	}




	//INICIALIZACION COMPONENTES GRAFICOS -----------------------------
	var initElements = function(){
		//color de los titulos
		$(".my_titulo").css("color", color_distintivo_usuarios_texto);
		$(".my_titulo").css("background-color", color_distintivo_usuarios_fondo); //asignamos el color de la barra distintiva en las modales

		//barra distintiva en ventanas -----------------------------
		$(".barra_distintiva_color").css("background-color", color_distintivo_usuarios_fondo); //asignamos el color de la barra distintiva en las modales
	}
	

	//===================================================================================================="
	//INICIALIZACION DE VARIABLES Y COMPONENTES ========================================================== 


	
	//inicializar elementos jquery por primera vez -------------------------------
	var initComponentsJquery = function(){
		//ejecucion unica primeros----		
		updateTableParameters();

		pintarPopoversSobreFiltrosTabla();
		
		definirBotonVerRegistroVerVentanaModal();
		definirBotonDuplicarCascada();
		definirBotonDuplicarActualizar();
		definirBotonEditarMostrarVentanaModal();
		definirBotonBorrarMostrarVentanaModal();
		definirEstadoMostrarColumnas();
		ajustarEstadoRegistros();
		pintarBotonesExtraTablesorter();
		definirPopovers();

		//ejecucion unica ----
		initElements();
		initErrorMsg();
		setListaCamposSeleccionadosModal();
		ajustarListaCamposSegunRol();

		//esta funcion esta implementada en loader.php
		hideLoader(); 
	}

	//ejecutar para actualizar elementos jquery y otros -----------
	var recargarComponentsJquery = function(){
		
		borrarExcesoTablesorterResizableContainer();
		pintarPopoversSobreFiltrosTabla();

		definirBotonVerRegistroVerVentanaModal();
		definirBotonDuplicarCascada();
		definirBotonDuplicarActualizar();
		definirBotonEditarMostrarVentanaModal();
		definirBotonBorrarMostrarVentanaModal();
		definirEstadoMostrarColumnas();
		ajustarEstadoRegistros();
		pintarBotonesExtraTablesorter();
		definirPopovers();
		//esta funcion esta implementada en loader.php
		hideLoader(); 
	}

	initComponentsJquery();
	
});


 //el siguiente objeto tendra almacenados los codigos de error definidos
var popover_msg = new Object();


 //popover de buscar registros -------
popover_msg.title_buscar_base_datos_todos = "Búscar Todo en la Dase de Datos";
popover_msg.data_buscar_base_datos_todos = "Muestra los resultados de la búsqueda de todos los registros en la base de datos.";

popover_msg.title_buscar_base_datos = "Buscar con filtrado en la Dase de Datos";
popover_msg.data_buscar_base_datos = "Muestra opciones de filtrado para la búsqueda en la búsqueda en la base de datos.";

popover_msg.title_buscar_uncheck_checkboxes = "Habilita o deshabilita los campos";
popover_msg.data_buscar_uncheck_checkboxes = "Habilita o deshabilita los campos considerados para labúsqueda.";

popover_msg.title_buscar_reiniciar_campos = "Limpiar campos";
popover_msg.data_buscar_reiniciar_campos = "Limpia los campos de la búsqueda.";

		 
//popover de mostrar todos los datos -------
popover_msg.title_limpiar_filtros = "Limpiar filtros";
popover_msg.data_limpiar_filtros = "Limpia los filtros locales.";


//popover de mostrar campos default -------
popover_msg.title_mostrar_tabla_default = "Mostrar campos definidos por default";
popover_msg.data_mostrar_tabla_default = "Muestra los campos de la búsqueda asignados por default.";

//popover de mostrar todos los datos -------
popover_msg.title_mostrar_campos_seleccionados = "Mostrar campos seleccionados";
popover_msg.data_mostrar_campos_seleccionados = "Selecciona y muestra los campos seleccionados en la lista de campos.";

//popover de mostrar todos los datos -------
popover_msg.title_mostrar_todos_campos = "Mostrar todos los campos";
popover_msg.data_mostrar_todos_campos = "Muestra todos los campos de la búsqueda.";

//popover de mostrar campos seleccionados -------
popover_msg.title_seleccionar_campos_para_mostrar = "Selección de campos"; 
popover_msg.data_seleccionar_campos_para_mostrar = "Muestra la lista de campos para seleccionar los que se quieren mostrar.";

//popover de mostrar_modal_nuevo_registro -------
popover_msg.title_mostrar_modal_nuevo_registro = "Nuevo registro";
popover_msg.data_mostrar_modal_nuevo_registro = "Crear un nuevo registro.";
//popover de mostrar_modal_nuevo_registro -------
popover_msg.title_mostrar_modal_editar_bloque_registros = "Editar registros seleccionados";
popover_msg.data_mostrar_modal_editar_bloque_registros = "Edita en bloque todos los registros seleccionados (checkbox).";

//popover de mostrar_modal_nuevo_registro -------
popover_msg.title_mostrar_modal_borrar_bloque_registro = "Borrar registros seleccionados";
popover_msg.data_mostrar_modal_borrar_bloque_registro = "Borra todos los registros seleccionados (checkbox).";

//botones de los registros -----------------------------------------

//duplicar registro -------
popover_msg.title_duplicar_registro = "Duplicar en cascada";
popover_msg.data_duplicar_registro = "Duplica este registro en cascada. El registro duplicado en cascada esta indicado en otro color y una etiqueta que hace referencia al registro original.";

popover_msg.title_duplicar_registro = "Duplicar";
popover_msg.data_duplicar_registro = "Duplica este registro. El registro duplicado esta indicado en otro color y una etiqueta que hace referencia al registro original.";

//duplicar registro -------
popover_msg.title_editar_registro = "Editar";
popover_msg.data_editar_registro = "Edita este registro.";

//borrar registro -------
popover_msg.title_borrar_registro = "Borrar";
popover_msg.data_borrar_registro = "Borra este registro.";



//botones del pager -----------------------------------------------
popover_msg.title_bt_pager_first = "Ir a primera página";
popover_msg.data_bt_pager_first = "Muestra la primera página de la búsqueda de registros.";

popover_msg.title_bt_pager_prev = "Ir a la página previa";
popover_msg.data_bt_pager_prev = "Muestra la página previa de la búsqueda de registros.";

popover_msg.title_bt_pager_next = "Ir a la siguiente página";
popover_msg.data_bt_pager_next = "Muestra la página siguiente de la búsqueda de registros.";

popover_msg.title_se_num_elem = "Número de elementos por página";
popover_msg.data_se_num_elem = "Selecciona el número de elementos por página.";

popover_msg.title_se_num_pag = "Número de página";
popover_msg.data_se_num_pag = "Selecciona el número de página.";
		 

//=================================================================================================================================================================
//Los siguientes son mensajes de los campos y filtros, estos pueden variar segun la pagina.php que se este consultando

//ayuda de los encabezados de las tablas  ----------------------------------------------------------------------------------------------
//NOTA: para insertar newline se ocupa <br /> y se debe de colocar el atributo data-html="true" en el elemento 
/*popover_msg.title_th_indice = "Número de registro mostrado";
popover_msg.data_th_indice = "Este es solo un contador, no existe como campo en la base de datos. Los campos numericos se puede filtrar por ejemplo:  \
  <br />1) Comparando:	5, >=5, <= 5<br />2) Intervalo: 5 - 100<br />3) Operaciones logicas: 5|100<br />4) Comodín * (cualquier valor): 5*3 ó  ó 85*|86*";

popover_msg.title_th_id = "ID en la base de datos";
popover_msg.data_th_id = "Este ID corresponde es un campo en la base de datos (no editable). Los campos numericos se puede filtrar por ejemplo:  \
  <br />1) Comparando:	5, >=5, <= 5<br />2) Intervalo: 5 - 100<br />3) Operaciones logicas: 5|100<br />4) Comodín * (cualquier valor): 5*3";

popover_msg.title_th_fecha_registro = "Fecha del registro en la base de datos";
popover_msg.data_th_fecha_registro = "Esa fecha es cuando se creo el registro en la base de datos (no editable). Los campos alfanumericos se pueden filtrar por ejemplo:  \
  <br />1) Coincidencias: 2020-04-19 ó 2020-04-19|2020-07-10<br/>2)Intervalo: 2020-04-28 - 2020-05-13<br />3) Comparando: <=2020-05-13 ó >=2020-05-13 01:24:22";

popover_msg.title_th_nombre = "Nombre en la base de datos";
popover_msg.data_th_nombre = "Este nombre corresponde un campo de la base de datos. Los campos alfanumericos se pueden filtrar por ejemplo:  \
  <br />1) laptop<br/>2) Comodín * (cualquier valor): lap*op<br />3) A*{space} ó lap|br*|c<br/>";

popover_msg.title_th_descripcion = "Descripción en la base de datos";
popover_msg.data_th_descripcion = "Esta descripción corresponde un campo de la base de datos. Los campos alfanumericos se pueden filtrar por ejemplo:  \
  <br />1) laptop<br/>2) Comodín * (cualquier valor): lap*op<br />3) A*{space} ó lap|br*|c<br/>";

popover_msg.title_th_estado_registro = "Estado del registro en la base de datos";
popover_msg.data_th_estado_registro = "Este estado de registro corresponde un campo de la base de datos. Solo se muestran en la selección los que estan presentes en la búsqueda actual.";

popover_msg.title_th_acciones = "Acciones sobre los registros";
popover_msg.data_th_acciones = "Estas funciones se aplican sobre su propio registro.";	*/	 




//ayuda de los encabezados de las tablas  ----------------------------------------------------------------------------------------------
//NOTA: para insertar newline se ocupa <br /> y se debe de colocar el atributo data-html="true" en el elemento 
popover_msg.title_filtro_numerico = "Filtro númerico";
popover_msg.data_filtro_numerico = "Los campos numericos se puede filtrar por ejemplo: <br />1) Comparando:	5, >=5, <= 5<br />2) Intervalo: 5 - 100<br />3) Operaciones logicas: 5|100<br />4) Comodín * (cualquier valor): 5*3 ó  ó 85*|86*";

popover_msg.title_filtro_fecha = "Filtro de fecha";
popover_msg.data_filtro_fecha = "Estos se pueden filtrar por ejemplo: <br />1) Coincidencias: 2020-04-19 ó 2020-04-19|2020-07-10<br/>2)Intervalo: 2020-04-28 - 2020-05-13<br />3) Comparando: <=2020-05-13 ó >=2020-05-13 01:24:22";

popover_msg.title_filtro_alfanumerico = "Filtro Alfanumerico";
popover_msg.data_filtro_alfanumerico = "Los campos alfanumericos se pueden filtrar por ejemplo:<br />1) laptop<br/>2) Comodín * (cualquier valor): lap*op<br />3) A*{space} ó lap|br*|c<br/>";


popover_msg.title_checkbox_all  = "Seleccionar Todos";
popover_msg.data_checkbox_all = "Selecciona o deselecciona todos los checkbox visibles en la página. Los checkbox de otras páginas no son afectados.";
	 



		 
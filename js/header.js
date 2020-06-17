

//FUNCION READY DEL HEADER
$(function() {

	//boton de salir (logout)-----------------------------
	$( "#btn_login_out" ).click(function() {
		  //alert("eeee");
		  window.location.replace("logout.php?LOGOUT=true");
	});


  //boton de informacion -----------------------------
  $( "#btn_info" ).click(function() {
      $("#Modal_Ayuda").modal('show');
  });



//-- Popover ----------------------------------------------------------------------------

  $('[data-toggle="popover"]').popover({
      container: 'body',
      trigger : 'hover', //<--- you need a trigger other than manual
      delay: { 
         show: "500", 
         hide: "100"
      }
  });

  //inicializamos los textos de titulo y dato de los popover
  var initPopoverTitlesData = function(){
    //ayuda -------
     var title_info ="Información";
     data_info = "Ver información de esta aplicación";
     $('#btn_info').attr('data-original-title', title_info);
     $('#btn_info').attr("data-content", data_info);
  }


  //valida estado se checkbox para habilitar o deshabilitar popovers------
  var validarEstadoCheckboxHablitarPopover = function() {
    //validamos el estado del checkbox
    if ( $('#checkbox_activar_ayuda_id').is(':checked') ) {
      	$('[data-toggle="popover"]').popover('enable');
    }
    else{
    	$('[data-toggle="popover"]').popover('disable');
    }
  };


  //evento check para habilitar o deshabilitar popovers------
  $('#checkbox_activar_ayuda_id').click(function() {

      var obj = new Object();
    	obj.help_enabled = ( $('#checkbox_activar_ayuda_id').prop('checked') ) ?1:0;
    	var obj_json = JSON.stringify(obj);

    	$.ajax({

          url : 'ajax_header.php',    // la URL para la petición
    	    type: 'GET',              // http method
        	dataType : 'text',        // el tipo de información que se espera de respuesta
    	    data: { 'funcion' : 'guardarEstadoActivarAyuda', 'datos' : obj_json },  // data to submit
    	    success: function (data, status, xhr) {
    	    	var obj = JSON.parse(data); //combierte json a objeto
    	    	
            //alert('status: ' + status + ', data: ' + data+', xhr: '+xhr);
            var valor_check = (obj.help_enabled=='1')?true:false;
            $("#checkbox_activar_ayuda_id").prop("checked", valor_check);

            //actualizamoslos estados del popover
            validarEstadoCheckboxHablitarPopover();
            
    	    },
    	    error: function (jqXhr, textStatus, errorMessage) {
    	            //$("#my_id1").append('Error' + errorMessage);
    	            alert('Error' + errorMessage);
    	    }
    	});
  });


  //-- Inicializacion de variables ------------------------------------------------------
  //definimos esta funcion en un scope superior para que pueda ser accesada por otros jquery
  //es como hacerla global
  window.initComponentsHeaderJquery = function() {
      validarEstadoCheckboxHablitarPopover();
   }; 

   //llamado de funciones generales --------------
   window.initComponentsHeaderJquery();
   initPopoverTitlesData();

});



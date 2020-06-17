
//DEFINICION VARIABLES GLOBALES

//CONSTANTES DE ROL
const ROL_ADMIN        = '1';
const ROL_SUPERUSUARIO = '2';
const ROL_USUARIO      = '3';
const ROL_INVITADO     = '3';

//estado de registgro	
var estado_registro_id_normal    = 1; //definido en la tabla c_estado_registro 1 es normal
var estado_registro_id_pendiente = 2; //definido en la tabla c_estado_registro 2 es pendiente
var estado_registro_id_revision  = 3; //definido en la tabla c_estado_registro 3 es revision
var estado_registro_id_duplicado = 4; //definido en la tabla c_estado_registro 4 es duplicado
var estado_registro_id_duplicado_en_cascada = 5; //definido en la tabla c_estado_registro 5 es duplicado en cascada



//=======================================================================================================
//MODALES ------------------------------------------------------------------------------------
//=======================================================================================================

//MODAL DE NUEVO, EDITAR, BORRAR ------------------------------------------------------------------------------------

//colores de las letras de los encabezados de las ventanas modales ------
var modal_header_color_nuevo    = "#FFFFFF";
var modal_header_color_ver      = "#FFFFFF";
var modal_header_color_editar   = "#000000";
var modal_header_color_duplicar = "#FFFFFF";
var modal_header_color_borrar   = "#FFFFFF";

//colores del fondo de los encabezados de las ventanas modales ------
var modal_header_color_fondo_nuevo    = "#28a745";
var modal_header_color_fondo_ver      = "#7a00ff";
var modal_header_color_fondo_editar   = "#ffc107";
var modal_header_color_fondo_duplicar = "#8080ff";
var modal_header_color_fondo_borrar   = "#dc3545";


//MODAL DE NUEVO, EDITAR, BORRAR ------------------------------------------------------------------------------------
var modal_header_color_buscar   = "#FFFFFF";
var modal_header_color_fondo_buscar   = "#007bff";


//MODAL DE ERROR ------------------------------------------------------------------------------------
var modal_error_header_color_borrar   = "yellow";
var modal_error_header_color_fondo_borrar   = "#dc3545";


//=======================================================================================================
//COLORES CATALOGOS ------------------------------------------------------------------------------------
//=======================================================================================================


//TITULO Y MODALES DE NUEVO, EDITAR, BORRAR ------------------------------------------------------------------------------------

var color_distintivo_activo_texto  = "white";
var color_distintivo_activo_fondo  = "#344BDB";

var color_distintivo_tipo_activo_texto = "white";
var color_distintivo_tipo_activo_fondo = "#6434DB";

var color_distintivo_centros_trabajo_texto = "white";
var color_distintivo_centros_trabajo_fondo = "green";

var color_distintivo_usuarios_texto = "white";
var color_distintivo_usuarios_fondo = "#8F0772";

var color_distintivo_ubicacion_texto = "white";
var color_distintivo_ubicacion_fondo = "#8F0772";


var color_distintivo_grupos_texto = "white";
var color_distintivo_grupos_fondo = "#8F0772";

var color_distintivo_subgrupos_texto = "white";
var color_distintivo_subgrupos_fondo = "#8F0772";
    
var color_distintivo_estado_registros_texto = "white";
var color_distintivo_estado_registros_fondo = "#8F0772";

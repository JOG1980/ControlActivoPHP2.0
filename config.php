<?php
//estos son los datos de acceso al la base de datos. se ponen de esta manera para qiue no puedan ser 
//vistos por los usuarios a travez cdde un navegador. 
//Este archivo se debe de incliuor en tidas las llamadas a base de datos apara que existan los datos de configuracion.

//VARIABLES DEL BASE DE DATOS ====================================================
$dbHost = "localhost:3306";
$dbUsername = "gmocontrolactivo_usuario";
$dbPassword = "gmocontrolactivo_password";
$dbName  = "GMOControlActivo";

const ROL_ADMIN        = '1';
const ROL_SUPERUSUARIO = '2';
const ROL_USUARIO      = '3';
const ROL_INVITADO     = '4';



//VARIABLES DEL HEADER ===========================================================
$titulo_header  = "ZONA DE OPERACION DE TRANSMISION GUERRERO MORELOS";


?>
<?php

	session_start();

//si la variable LOGIN_OUT es verdadera entonces sale
if(isset($_GET["LOGOUT"]) && $_GET["LOGOUT"] ){
  
   //session_destroy();
	$_SESSION["LOGIN_OK"] = false;

  session_unset();
  session_destroy();
  header("Location: login.php");
  exit();
}

?>

<?php

	 $dbhost = 'localhost:3306';
         $dbuser = 'gmocontrolactivo_usuario';
         $dbpass = 'gmocontrolactivo_password';
         $db_name = 'GMOControlActivo';
         
         /*$conn = mysql_connect($dbhost, $dbuser, $dbpass);
      
         if(! $conn ) {
            die('Could not connect: ' . mysql_error());
         }
         
         echo 'Connected successfully';
         mysql_close($conn);
*/
         $mysqli = mysqli_connect($dbhost, $dbuser, $dbpass, $db_name);

		if (!$mysqli) {
		    echo "Error: Unable to connect to MySQL." . PHP_EOL;
		    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
		    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
		    exit;
		}

		echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
		echo "Host information: " . mysqli_get_host_info($mysqli) . PHP_EOL;

		$line ="";
		$sql = "SELECT tipo_activo_id, nombre, descripcion FROM c_tipo_activo";

	    if ($result = $mysqli->query($sql)) {
	        while($obj = $result->fetch_object()){
	            $line.=$obj->tipo_activo_id;
	            $line.=$obj->nombre;
	            $line.=$obj->descripcion;
	        }
	    }
	    $result->close();
	    unset($obj);
	    unset($sql);
	    unset($query);


	    echo ">>>> ".$line."<br />";


		mysqli_close($mysqli);


?>
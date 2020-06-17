<?php



function connectdb($dbHost, $dbName, $dbUsername, $dbPassword){
	$db = new mysqli(
		$dbHost,
		$dbUsername,
		$dbPassword,
		$dbName
	);

	if($db->connect_error){
		die("Cannot connect to data base: \n"
			. $db->connect_error . "\n"
			. $db->connect_errno 
		);

	}
	return $db;
}

//-- USANDO FETCH_ASSOC -----------------------------------------
function fetchAll_fetch_assoc(mysqli $db, $sql){
	$data = [];
	$results = $db->query($sql);

	if($results->num_rows > 0){
		while( $row = $results->fetch_assoc() ){
			$data[] = $row;
		}

	}
	//var_dump($data); //imprime el contenido del objeto
	return $data;
}

//-- USANDO FETCH_OBJECT -----------------------------------------
function fetchAll_fetch_object(mysqli $db){
	$data = [];
	$sql = 'SELECT * FROM c_tipo_activo';
	$results = $db->query($sql);

	if($results->num_rows > 0){
		while( $row = $results->fetch_object() ){
			$data[] = $row;
		}

	}
	//var_dump($data); //imprime el contenido del objeto
	return $data;
}


?>
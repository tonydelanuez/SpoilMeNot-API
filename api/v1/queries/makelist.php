<?php
//SELECT * FROM `items` WHERE `id`= LAST_INSERT_ID()

function makeList($list_title, $list_show, $conn){
	$stmt = $conn->prepare('INSERT INTO wordlists (title, show_name) VALUES (?, ?)');
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param("ss", $list_title, $list_show);
	if(!$stmt->execute()){
		echo 'failed at first execute';
		return False;
	} 
	$stmt->close();
	$last_id = $conn->insert_id;
	$stmt = $conn->prepare("SELECT * FROM wordlists WHERE id=$last_id");
	if(!$stmt){
		printf("Second Query Prep Failed: %s\n", $conn->error);
		return False;
	}

	$stmt->execute();
	$resultSet = $stmt->get_result();
	$result = $resultSet->fetch_all();
	$stmt->close();
	return $result[0][0];
}

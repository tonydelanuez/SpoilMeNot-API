<?php
function getLists($conn){
	$lists = array();
	$stmt = $conn->prepare('SELECT * FROM wordlists');
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $conn->error);
		exit;
	}
	$stmt->execute();
	$stmt->bind_result($id, $list_name, $show_name);
	while($stmt->fetch()){
		$result = array(
			"id" => htmlspecialchars($id),
			"list_name" => htmlspecialchars($list_name),
			"show_name" => htmlspecialchars($show_name)
		);
		array_push($lists, $result);
	}
	$stmt->close();
	return $lists;
}

<?php
function addWords($list_id, $new_words, $conn){
	$data = array();
	$query = 'INSERT INTO words (word, list) VALUES ';
	foreach($new_words as $row){
		$data[] = '("'.$row.'", '.$list_id.')';
	}
	$query .= implode(',', $data);
	$stmt = $conn->prepare($query);
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('i', $list_id);
	$stmt->execute();
	if(!$stmt){
		$stmt-close();
		return False;
	}
	$stmt->close();
	return True;
}
?>
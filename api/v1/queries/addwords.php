<?php
function addWords($list_id, $new_words, $conn){
	$data = array();
	$query = 'REPLACE INTO words (word, list) VALUES ';
	foreach($new_words as $row){
		if(!(ctype_space($row) || $row == "")){
			$data[] = '("'.$row.'", '.$list_id.')';
		}
	}
	$query .= implode(',', $data);
	$stmt = $conn->prepare($query);
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $conn->error);
		exit;
	}
	$stmt->execute();
	$num_rows = mysqli_affected_rows($conn);
	return $num_rows;
}

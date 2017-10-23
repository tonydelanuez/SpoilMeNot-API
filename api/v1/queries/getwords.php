<?php
function getWords($list_id, $conn){
	$words = array();
	$stmt = $conn->prepare('SELECT * FROM words WHERE list=?');
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('i', $list_id);
	$stmt->execute();
	$stmt->bind_result($id, $word, $list);
	while($stmt->fetch()){
		array_push($words, htmlspecialchars($word));
	}
	$stmt->close();
	return $words;
}
?>
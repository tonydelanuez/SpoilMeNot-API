<?php 

function deleteWordFromList($listID, $word, $conn){
	$query = "DELETE FROM words WHERE word=? AND list=?";
	$stmt = $conn->prepare($query);
	if(!$stmt){
		printf("Query prep failed.");
		exit;
	}
	$stmt->bind_param('si', $word, $listID);
	$stmt->execute();
	$num_rows = mysqli_affected_rows($conn);
	return $num_rows;
}
<?php 

function deleteListFromUser($listID, $email, $conn){

	//Get the user's ID
	$stmt = $conn->prepare('SELECT * FROM users where email = ?');
	if(!$stmt){
		printf("Failed in check for username: %s\n", $conn->error);
		$stmt->close();
		return False;
	}
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo 'Failed to find user';
		$stmt->close();
		return False;
	} 
	$result_field = $result->fetch_assoc();
	$user_id = $result_field['id'];

	// Delete the list from the user's lists
	$query = "DELETE FROM userlists WHERE user=? AND list=?";
	$stmt = $conn->prepare($query);
	if(!$stmt){
		printf("Query prep failed.");
		exit;
	}
	$stmt->bind_param('ii', $user_id, $listID);
	$stmt->execute();
	$num_rows = mysqli_affected_rows($conn);
	return $num_rows;
}
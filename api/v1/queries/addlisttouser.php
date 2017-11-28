<?php
function addListToUser($list_id, $email, $conn){
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

	$stmt = $conn->prepare('SELECT * FROM userlists where user = ? AND list = ?');
	if(!$stmt){
		printf("Failed in check for username: %s\n", $conn->error);
		$stmt->close();
		return False;
	}
	$stmt->bind_param('ii', $user_id, $list_id);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows > 0){
		echo 'List already exists!';
		$stmt->close();
		return False;
	} 

	$stmt = $conn->prepare('REPLACE INTO userlists (user, list) VALUES (?, ?)');
	if(!$stmt){
		printf("Query Prep Failed when adding into userlists: %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('ii', $user_id, $list_id);
	$stmt->execute();
	$num_rows = mysqli_affected_rows($conn);
	return $num_rows;
}

<?php
function getListsForUser($email, $conn){
	$lists = array();
	$stmt = $conn->prepare('SELECT * FROM users WHERE email = ?');
	if(!$stmt){
		printf("Query Prep Failed: on select from users  %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo 'Login failed';
		$stmt->close();
		exit;
	} 
	$result_field = $result->fetch_assoc();
	$user_id = $result_field['id'];
	
	$stmt = $conn->prepare('SELECT * FROM userlists WHERE user=?');

	if(!$stmt){
		printf("Query Prep Failed on select from userlists: %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('i', $user_id);
	$stmt->execute();

	$stmt->bind_result($user_id, $list_id);

	$lists = array();
	while($stmt->fetch()){
		array_push($lists, $list_id);
	}
	$stmt->close();
	return $lists;
}

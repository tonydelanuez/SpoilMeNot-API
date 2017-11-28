<?php
session_start();
function login($email, $password, $conn){
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
		echo 'Login failed';
		$stmt->close();
		return False;
	} 
	$result_field = $result->fetch_assoc();
	if(password_verify($password, $result_field['password'])){
		$_SESSION['isLoggedIn'] = True;
		setcookie("loggedIn", $email, time() + (86400 * 30));
	} else {
		$stmt->close();
		return False;
	}
	$stmt->close();
	return True;
}

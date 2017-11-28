<?php
function register($email, $password, $conn){
	$stmt = $conn->prepare('SELECT * FROM users where email = ?');
	if(!$stmt){
		printf("Failed in check for username: %s\n", $conn->error);
		return False;
	}
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows > 0){
		echo 'Email already taken';
		return False;
	} 

	// Create the user in the database
	$passhash = password_hash($password, PASSWORD_DEFAULT);
	$stmt = $conn->prepare('INSERT INTO users(email, password) VALUES (?, ?)');
	$stmt->bind_param('ss', $email, $passhash);
	if(!$stmt->execute()){
		echo 'failed to create user.';
		return False;
	}

	// Grab the user's ID
	$stmt = $conn->prepare('SELECT * FROM users WHERE email = ?');
	if(!$stmt){
		printf("Query Prep Failed: on select from users  %s\n", $conn->error);
		exit;
	}
	$stmt->bind_param('s', $email);
	$stmt->execute();
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo 'Could not find user in table';
		$stmt->close();
		exit;
	} 
	$result_field = $result->fetch_assoc();
	$user_id = $result_field['id'];

	// Insert a wordlist that is unique to the user
	$stmt = $conn->prepare("INSERT INTO wordlists(title, show_name) VALUES (?, ?)");
	$stmt->bind_param('ss', $email, $a = "PERSONAL LIST");
	if(!$stmt->execute()){
		echo 'failed to create list for user.';
		return False;
	}

	//Look for the list created when the user joined
	$stmt = $conn->prepare("SELECT * FROM wordlists WHERE title = ?");
	$stmt->bind_param('s', $email);
	if(!$stmt->execute()){
		echo 'failed to fetch created list for user.';
		return False;
	}
	$result = $stmt->get_result();
	if($result->num_rows == 0){
		echo 'Email already taken';
		return False;
	} 
	$result_field = $result->fetch_assoc();
	$list_id = $result_field['id'];

	//Add user list to the 
	$stmt = $conn->prepare("INSERT INTO userlists(user, list) VALUES (?, ?)");
	$stmt->bind_param('ii', $user_id, $list_id);
	if(!$stmt->execute()){
		echo 'failed to associate list with user.';
		return False;
	}

	$stmt->close();
	return True;
}

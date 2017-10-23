<?php

$mysqli = new mysqli('127.0.0.1', 'api', 'blu3b00t', 'spoilmenot');

if($mysqli->connect_errno){
	printf("Connection failed: %s\n", $mysqli->connect_errno);
	exit;
} 
?>

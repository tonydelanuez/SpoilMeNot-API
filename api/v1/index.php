<?php
/* Switch statement based on the command sent:
        - Add word to wordlist
        - Create wordlist with words
        - Create/Register user
        - Add wordlist to user wordlists
*/
include_once('../config/database.php');
include_once('./queries/getwords.php');
include_once('./queries/getlists.php');
include_once('./queries/addwords.php');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Defines for each API command.
define("GETWORDS", 'getWords');
define("GETLISTS", 'getLists');
define("CREATELIST", 'createList');
define("ADDWORD", 'addWordToList');
define("DELETEWORD", 'deleteWordFromList');
define("CREATEUSER", 'createUser');

$request_type = $_SERVER['REQUEST_METHOD'];

$response = array(
        "status" => 200,
        "message" => "SpoilMeNot API endpoint is live.",
        "requestType" => $request_type
        );

if (isset($_GET['command'])){
	$response['command'] = $_GET['command'];
}

switch($response['command']){
	case GETWORDS:
		if (isset($_GET['wordListID'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$response['message'] = "Looking for words!";
			$response['words'] = getWords($response['wordListID'], $mysqli);
			if (count($response['words']) == 0){
				$response['message'] = "No words found for that word list ID.";
			}
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID.";
			$response['status'] = 400;
		}
		break;
	case GETLISTS:
		$response['message'] = "Fetching lists!";
		$response['lists'] = getLists($mysqli);
		break;
	case CREATELIST:
		break;
	case ADDWORD:
		if (isset($_GET['wordListID']) && isset($_GET['word'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$words = $_GET['word'];
			if (count($words) == 0){
				$response['message'] = "Empty word list!";
				$response['status'] = 400;
			} else {
				if(addWords($response['wordListID'], $words, $mysqli)){
					$response['message'] = "Successfully added words to the wordlist!";
				}
			}
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID or a list of words";
			$response['status'] = 400;
		}
		break;
	case DELETEWORD:
		break;
	case CREATEUSER:
		break;
}

echo json_encode($response);

?>

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
include_once('./queries/getuserlists.php');
include_once('./queries/addlisttouser.php');
include_once('./queries/deletelistfromuser.php');
include_once('./queries/addwords.php');
include_once('./queries/makelist.php');
include_once('./queries/deleteword.php');
include_once('./scripts/login.php');
include_once('./scripts/logout.php');
include_once('./scripts/register.php');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Defines for each API command.
define("GETWORDS", 'getWords');
define("GETLISTS", 'getLists');
define("GETUSERLISTS", 'getUserLists');
define("CREATELIST", 'createList');
define("ADDWORD", 'addWordToList');
define("ADDLISTTOUSER", 'addListToUser');
define("DELETEWORD", 'deleteWordFromList');
define("DELETELISTFROMUSER", 'deleteListFromUser');
define("REGISTER", 'register');
define("LOGIN", 'login');
define("LOGOUT", 'logout');

$request_type = $_SERVER['REQUEST_METHOD'];

$response = array(
        "status" => 200,
        "message" => "SpoilMeNot API endpoint is live.",
        "requestType" => $request_type
        );

// Check to make sure user is logged in
// if(isset($_COOKIE['loggedIn'])){
// 	$response['status'] = 200;
// 	$response['message'] = "Logged in.";
// 	$response['isLoggedIn'] = True;
// } else {

// 	$response['status'] = 403;
// 	$response['message'] = "Not logged in!";
// 	$response['isLoggedIn'] = False;
// 	echo json_encode($response);
// 	exit;
// }

if (isset($_GET['command'])){
	$response['command'] = $_GET['command'];
}
if (isset($_POST['command'])){
	$response['command'] = $_POST['command'];
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
	case GETUSERLISTS:
		$response['message'] = "Fetching lists for user";
		$response['lists'] = getListsForUser($_GET['email'], $mysqli);
		break;
	case ADDLISTTOUSER:
		$response['message'] = "Adding lists for user";
		if (isset($_GET['wordListID']) && isset($_GET['email'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$response['email'] = $_GET['email'];
			$rows_added = addListToUser($response['wordListID'], $response['email'], $mysqli);
			if($rows_added > 0 ){
				$response['message'] = "$rows_added lists were added or updated in the user's lists.";
			} else {
				$response['message'] = "No words were added to the user's lists.";
			}
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID or a user email.";
			$response['status'] = 400;
		}
		break;
	case CREATELIST:
		if (isset($_GET['newListTitle']) && isset($_GET['newListShow'])){
			$response['newListTitle'] = htmlspecialchars($_GET['newListTitle']);
			$response['newListShow'] = htmlspecialchars($_GET['newListShow']);

			$list_id = makeList($response['newListTitle'], $response['newListShow'], $mysqli);
			$response['newListID'] = $list_id;
			$rows_added = 0;
			if (isset($_GET['word'])){
				$words = $_GET['word'];
				$words = array_map('htmlspecialchars', $words);
				$response['addedWords'] = $words;
				$rows_added = addWords($list_id, $words, $mysqli);
			} 
			// if($rows_added > 0  &&  $list_id){
			if ($list_id){
				$response['message'] = "$rows_added words were added to the new wordlist with ID $list_id";
			} else {
				$response['message'] = "No words were added to the wordlist.";
			}

		} else { 
			$response['message'] = "Oops! You forgot to specify a list title or name of show.";
			$response['status'] = 400;
		}
		break;
	case ADDWORD:
		if (isset($_GET['wordListID']) && isset($_GET['word'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$words = $_GET['word'];
			$words = array_map('htmlspecialchars', $words);
			if (count($words) == 0){
				$response['message'] = "Empty word list!";
				$response['status'] = 400;
			} else {
				$rows_added = addWords($response['wordListID'], $words, $mysqli);
				if($rows_added > 0 ){
					$response['message'] = "$rows_added words were added or updated in the wordlist";
				} else {
					$response['message'] = "No words were added to the wordlist.";
				}
			}
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID or a list of words";
			$response['status'] = 400;
		}
		break;
	case DELETEWORD:
		if (isset($_GET['wordListID']) && isset($_GET['word'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$word = $_GET['word'];
			if (count($word) == 0){
				$response['message'] = "Empty word list!";
				$response['status'] = 400;
			} else {
				$rows_added = deleteWordFromList($response['wordListID'], $word, $mysqli);
				if($rows_added > 0 ){
					$response['message'] = "$rows_added words were deleted or updated in the wordlist";
				} else {
					$response['message'] = "No words were deleted from the wordlist.";
				}
			}
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID or a list of words";
			$response['status'] = 400;
		}
		break;
	case DELETELISTFROMUSER:
		if (isset($_GET['wordListID']) && isset($_GET['email'])){
			$response['wordListID'] = htmlspecialchars($_GET['wordListID']);
			$email = $_GET['email'];
			$rows_added = deleteListFromUser($response['wordListID'], $email, $mysqli);
			if($rows_added > 0 ){
				$response['message'] = "$rows_added words were deleted or updated in the wordlist";
			} else {
				$response['message'] = "No words were deleted from the wordlist.";
			}
		
		} else {
			$response['message'] = "Oops! You forgot to specify a word list ID or a list of words";
			$response['status'] = 400;
		}
		break;
	case REGISTER:
		if (isset($_POST['email']) && isset($_POST['password'])){
			$email = $_POST['email'];
			$password = $_POST['password'];
			if(register($email, $password, $mysqli)){
				login($email, $password, $mysqli);
			}
		} else {
			$response['message'] = "Oops! You left out a username or password in registration.";
			$response['status'] = 400;
		}
		break;
	case LOGIN: 
		if (isset($_POST['email']) && isset($_POST['password'])){
			if(login($_POST['email'], $_POST['password'], $mysqli)){
				$response['message'] = "Login succeeded!";
				$response['status'] = 200;
			} else {
				$response['message'] = "Login failed.";
				$response['status'] = 403;
			}
		} else {
			$response['message'] = "Oops! You left out a username or password.";
			$response['status'] = 400;
		}
		break;
	case LOGOUT:
		setcookie("loggedIn", "", time() - 3600); 
		session_destroy();
		break;
	default:
		$response['message'] = "Invalid command, try again.";
		$response['status'] = 400;
		break;
}

echo json_encode($response, JSON_PRETTY_PRINT);
exit;



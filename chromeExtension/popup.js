//Login Page
window.onload = function(){
    chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
    // do something with the cookie
    //console.log(cookie.name);
    //alert(cookie.name + ' found, value: ' + cookie.value);
    console.log(cookie);
    if (cookie === null) {
        loginPage.hidden = false;
        userPage.hidden = true;
        alertPage.hidden = true;
        createAccountPage.hidden = true;
        return;
    }

    if (cookie.name == "loggedIn") {
      userPage.hidden = false;
      loginPage.hidden = true;
      alertPage.hidden = true;
      createAccountPage.hidden = true;
    }
});
}

//Global Functions and Initial Variables
// loginPage.hidden = false;
// userPage.hidden = true;
// createAccountPage.hidden = true;

//General Functions
function openNewPage(oldPage, newPage){
  document.getElementById(oldPage).hidden = true;
  document.getElementById(newPage).hidden = false;
}

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200){
                aCallback(anHttpRequest.responseText);
            }
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

var getList = "http://104.131.2.125/spoilmenot/api/v1/?command=getLists";
var client = new HttpClient();
var lastID = "";
var currentUserID = "";

function hello() {
  console.log("hello");
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
      var word;

      for(word in response.msg){
        console.log("here?");
        var ul = document.getElementById("divi");
        var li = document.createElement("li");
        console.log(response.msg[word]);
        var value = response.msg[word];
        li.appendChild(document.createTextNode(value));
        ul.appendChild(li);
        //document.getElementById("div").textContent = response.msg[word];

      }
    //  document.getElementById("div").textContent = response.msg;
    });
}



/*THIS IS THE FUNCTIONALITY FOR EACH INDIVIDUAL PAGE*/

//Login Page
var loginPage = document.getElementById('loginPage');
var userSignin = document.getElementById('userSignin');
var userPassword = document.getElementById('userPassword');
var userLoginButton = document.getElementById('loginButton');
var createAccountButton = document.getElementById('createAccountButton');


userLoginButton.addEventListener("click", function(){
  verifyLogin();
})

createAccountButton.addEventListener("click", function(){
  openNewPage('loginPage', 'accountCreationPage');
});



//At this point, the user is tracked and known so a session can be created to keep the user logged in.
// function verifyLogin(){
//   var signinEmail = userSignin.value;
//   var signinPassword = userPassword.value;
//   console.log(signinEmail, signinPassword);
//   client.get(getList, function(response) {
// 	    var userData = JSON.parse(response);
// 	    lastID = userData.lists[userData.lists.length-1].id;
// 	    for (var i = 0, len = parseInt(lastID); i < len; i++){
// 		    if (userData.lists[i].list_name == signinEmail && userData.lists[i].show_name == signinPassword){
// 		      console.log("Login worked.");
// 		      console.log(userData.lists[i].list_name + " " + userData.lists[i].show_name);
// 		      userSignin.value = "";
// 		      userPassword.value = "";
// 		      currentUserID = userData.lists[i].id;
// 			  console.log("API - You are in User ID: " + currentUserID);
// 			  openNewPage('loginPage', 'userPage');
// 		    }
// 		    else{
// 		      console.log("Make sure you have an account!");
// 		    }
// 		} 
// 	  });
// }

function verifyLogin(){
  var signinEmail = userSignin.value;
  var signinPassword = userPassword.value;
  console.log(signinEmail, signinPassword);
  $.post("http://104.131.2.125/spoilmenot/api/v1/", {email: signinEmail, password: signinPassword, command: "login"}, function(){

    console.log("Login worked: cookie created");
  }).done(function(){
    openNewPage('loginPage', 'alertPage');
  });
}

var continueToUser = document.getElementById('continueToUser');
continueToUser.addEventListener("click", function(){
  openNewPage('alertPage', 'userPage');
});
//Create Account Page
var createAccountPage = document.getElementById('accountCreationPage');
var createAccountSubmit = document.getElementById('createAccountSubmit');
var backButton = document.getElementById('backToSignin');

createAccountSubmit.addEventListener("click", function(){
  createAccount();
});

backButton.addEventListener("click", function(){
  openNewPage('accountCreationPage', 'loginPage');
});


//Create Account API ID
var postURL = ""; 
//Regex for Email found here: https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password, verifiedPassword){
  var re = /(?=.{8,})/;
  if (re.test(password)){
    if (password == verifiedPassword){ return true;}
  }
  else {console.log("Your password must be 8 characters");} 
}

function createAccount(){
  var newUserEmail = document.getElementById("newEmail").value;
  var newUserPassword = document.getElementById("newPassword").value;
  var newUserVerifiedPassword = document.getElementById("newVerifiedPassword").value;
  var filterOne = validateEmail(newUserEmail);
  var filterTwo = validatePassword(newUserPassword, newUserVerifiedPassword);
  //Check validators in console.log
  console.log(filterOne);
  console.log(filterTwo);
  if (filterOne && filterTwo){

    //The New User's email and password is posted to list_name and show_name respectively

    //instead of this we will post it to the database - and then run a post URL with their name or something instead
    //then grab the list ID again instead

    //then create a SESSION variable and we will check to see if we have a session everytime.

    postURL = "http://104.131.2.125/spoilmenot/api/v1/?command=createList&newListShow=" + newUserPassword + "&newListTitle=" + newUserEmail;
    $.post(postURL);

    //associate ID with account
    client.get(getList, function(response) {
	    //console.log(response);
	    var userData = JSON.parse(response);
	    //var currencyData = JSON.parse(response);
	    lastID = userData.lists[userData.lists.length-1].id;
	    console.log(lastID);
      getUrl = "http://104.131.2.125/spoilmenot/api/v1/?command=addListToUser&wordListID=" + lastID + "&email=" + newUserEmail;
      $.get(getUrl);
	});

    //var newUser = new user(newUserEmail, newUserPassword, lastID);
    //userArray.push(newUser);
    //console.log(newUser);
    //Place User Email and Password in the Login Values
    //This just makes the login intuitive for the new user
    //userSignin.value = newUserEmail;
    //userPassword.value = newUserPassword;
    //openNewPage('accountCreationPage', 'loginPage');

    $.post("http://104.131.2.125/spoilmenot/api/v1/", { email: newUserEmail, password: newUserPassword, command: "register" }, function() {
    	//alert("success");
      //openNewPage('loginPage', 'userPage');
    }).done(function(){
    openNewPage('accountCreationPage', 'loginPage');

  });
    
    return true;
  }
}

/*USER PAGE 1 FUNCTIONALITY*/
//User Page
// var userIdentification = document.getElementById('userIdentification');
// //var addWordURL = "http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + currentUserID + "&word%5B%5D=" + addedWord;

// var testingButton = document.getElementById('testing');
// testing.addEventListener("click", function(){
// 	console.log(currentUserID);
// 	userIdentification.innerHTML = currentUserID;
// 	updateWords();
// 	//$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=48&word%5B%5D=GOTIT");
// });

// var testingDelete = document.getElementById('testingDelete');
// testingDelete.addEventListener("click", function(){
// 	console.log(currentUserID);
// 	//userIdentification.innerHTML = currentUserID;
// 	deleteWords();
// 	//$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=48&word%5B%5D=GOTIT");
// });

// var testingLoad = document.getElementById('testingLoad');
// testingLoad.addEventListener("click", function(){
// 	console.log(currentUserID);
// 	loadListFunction();
// 	//userIdentification.innerHTML = currentUserID;
// 	//deleteWords();
// 	//$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=48&word%5B%5D=GOTIT");
// });

// var userWordList = "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID="; 
// function loadListFunction(){
// 	//associate ID with account
//     client.get(userWordList + currentUserID, function(response) {
// 	    console.log(response);
// 	    var userWordData = JSON.parse(response);
// 	    //var currencyData = JSON.parse(response);
// 	    //lastID = userData.lists[userData.lists.length-1].id;
// 	    //console.log(lastID);
// 	    console.log(userWordData.words.length-1);
// 	    var wordCount = parseInt(userWordData.words.length-1);
// 	    console.log(parseInt(userWordData.words.length-1));
// 	    $('ul').empty();
// 	    for (var i = 0, len = wordCount; i < len; i++){
// 	    	console.log(userWordData.words[i]);
// 	    	function1(userWordData.words[i]);
// 	    }
// 	});

// }



// var userPage = document.getElementById('userPage');
// // var userLogoutButton = document.getElementById('logoutButton');
// // userLogoutButton.addEventListener("click", function(){
// //   $.post("http://104.131.2.125/spoilmenot/api/v1/", { command: "logout" }, function() {
// //       console.log("cookie deleted: success");

// //   }).done(function(){
// //     openNewPage('userPage', 'loginPage');

// //   });
// //   ;
// // })



// // Rest of Code

// //1) Load the User's Lists or Say: no words in your list so far
// //2) allow user to add words to list: update the API: WORKS
// //3) allow users to delete words from the list: update the API: WORKS


// //this is for loading lists
// var count = 0;

// var content = document.getElementById('userContent').value;

// var ul = document.getElementById("list");
// var li = document.createElement("li");
// function function1(value) {
//   //console.log(value);
//   li.appendChild(document.createTextNode(value));
//   ul.appendChild(li);
// }

// // var submitButton = document.getElementById('submitButton');
// // submitButton.addEventListener("click", function(){
// // 		//function1();
// // 		//hello();
// // 		//updateWords();
// //     chrome.storage.sync.get('value', updateWords() );

// // });

// var submitWordToAPI = document.getElementById('submitWordToAPI');
// submitWordToAPI.addEventListener("click", function(){
// 		//function1();
// 		//hello();
// 		//updateWords();
// 	//http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=30&word[]=asdf
//   //$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=postedOnButtonClick");
// 	sendWordList();
//     chrome.storage.sync.get('value', updateWords() );

// });

// var deleteWordToAPI = document.getElementById('deleteWordToAPI');
// deleteWordToAPI.addEventListener("click", function(){
// 		//function1();
// 		//hello();
// 		//updateWords();
// 	//http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=30&word[]=asdf
//   //$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=postedOnButtonClick");
// 	sendWordList();
//     chrome.storage.sync.get('value', deleteWords() );

// });

// function deleteWords(){
//     // Save it using the Chrome extension storage API.
//     content = document.getElementById('userContent').value;
//     chrome.storage.sync.set({'value': content}, function() {
//       // Notify that we saved.
//       //message('Settings saved');
//       console.log(content);
//       var text = content;
//       //delete move here
//       $.post("http://104.131.2.125/spoilmenot/api/v1/?command=deleteWordFromList&wordListID=" + currentUserID + "&word=" + text);
//       //$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=" + text);
//       //here will also fill in the appropriate user id
// //$.post("http://104.131.2.125/spoilmenot/api/v1/?command=deleteWordFromList&wordListID=40&word=" + text);
//       //function1(content);
//     });

//     //function1(content);
// }


// //http://104.131.2.125/spoilmenot/api/v1/?command=deleteWordFromList&wordListID=72&word=Lol
// function sendWordList() {
//   chrome.runtime.sendMessage({
//       greeting: "sendWordList"
//     },
//     function(response) {
//     //  document.getElementById("div").textContent = response.msg;
//     });
// }

// // <script>
// // $(document).ready(function(){
// //     $("submitWordToAPI").click(function(){
// //         $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=30&word[]=testingThissubmission");
// //     });
// // });
// // </script>


// var searchButton = document.getElementById('searchButton');
// searchButton.addEventListener("click", function(){
//   if(count < 1){
//     hello();
//     count = count +1;
//   }
// })


// //This code programs the send to background button and makes the user-inputted word lists an array
// var newArray = ["Testing"];
// var sendButton = document.getElementById('gameOfThronesBlock');
// sendButton.addEventListener("click", function(){
//   $.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID=1", function( jsonData ) {
//     //var obj = JSON.parse(json);
//     //console.log(obj.lists.show_name);
//     //console.log(obj.lists[1].show_name + " " + obj.lists[2].show_name);
//     var word;

//     for (word in jsonData.words){
//       //console.log(jsonData.words[word]);
//       //console.log("");
//       //alert(jsonData.words[word]);
//       //console.log("Actual word to block: " + "/" + jsonData.words[word] + "/gi");
//       //again change this piece to be specific for user id
//       $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=" + jsonData.words[word]);
//       //textChangeArr.push(jsonData.words[word]);// + "/gi");
//     }
//    });
//   //add game of thrones list here instead

//   //Send button should send the list data to background.
//   //get
//   // var lis = document.getElementById("list").getElementsByTagName("li");
//   // for (i = 0; i < lis.length; i++){
//   //   console.log(lis[i].innerHTML);
//   //   newArray.push(lis[i].innerHTML);
//   // }
//   //var newArray = Array.from(lis.innerHTML);
//   //console.log(newArray);
// })


/*USER PAGE 2*/

var globalURL = "";
var globalEmail = "";
var userPage = document.getElementById('userPage');
var alertPage = document.getElementById('alertPage');

//Label Div
var userIdentification = document.getElementById('userIdentification');
var refreshButton = document.getElementById('refresh');
var userWordList = document.getElementById('list');
var addWordTextArea = document.getElementById("userBlockedWord");
var addWordButton = document.getElementById("blockThis");
var deleteWordTextArea = document.getElementById("userDeletedWord");
var deleteWordButton = document.getElementById("deleteThis");
var userLogoutButton = document.getElementById('logoutButton');

//PUBLIC USER LIST BUTTONS

var gotAdd = document.getElementById("gotAdd");
var gotDelete = document.getElementById("gotDelete");

$('#gotAdd').click(function(){
  console.log("works");
  addPublicList(1);
});

$('#gotDelete').click(function(){
  deletePublicList(1);
});

var bbAdd = document.getElementById("bbAdd");
var bbDelete = document.getElementById("bbDelete");

$('#bbAdd').click(function(){
  console.log("works");
  addPublicList(2);
});

$('#bbDelete').click(function(){
  deletePublicList(2);
});

var gbpAdd = document.getElementById("gbpAdd");
var gbpDelete = document.getElementById("gbpDelete");

$('#gbpAdd').click(function(){
  console.log("works");
  addPublicList(87);
});

$('#gbpDelete').click(function(){
  deletePublicList(87);
});

var mrAdd = document.getElementById("mrAdd");
var mrDelete = document.getElementById("mrDelete");

$('#mrAdd').click(function(){
  console.log("works");
  addPublicList(3);
});

$('#mrDelete').click(function(){
  deletePublicList(3);
});

var narcAdd = document.getElementById("narcAdd");
var narcDelete = document.getElementById("narcDelete");

$('#narcAdd').click(function(){
  console.log("works");
  addPublicList(86);
});

$('#narcDelete').click(function(){
  deletePublicList(86);
});

//
function addPublicList(wordID){
    chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
    globalEmail = decodeURIComponent(cookie.value);
    //var obj = JSON.parse(json);
    //console.log(obj.lists.show_name);
    //console.log(obj.lists[1].show_name + " " + obj.lists[2].show_name);

    //http://104.131.2.125/spoilmenot/api/v1/?command=addListToUser&wordListID=2&email=test@test.com
    $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addListToUser&wordListID=" + wordID + "&email=" + globalEmail);
    var word;
   });
    hello();
};

function deletePublicList(wordID){
    chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
    globalEmail = decodeURIComponent(cookie.value);
    //var obj = JSON.parse(json);
    //console.log(obj.lists.show_name);
    //console.log(obj.lists[1].show_name + " " + obj.lists[2].show_name);

    //http://104.131.2.125/spoilmenot/api/v1/?command=addListToUser&wordListID=2&email=test@test.com
    console.log("http://104.131.2.125/spoilmenot/api/v1/?command=deleteListFromUser&wordListID=1&email=" + globalEmail);
    $.post("http://104.131.2.125/spoilmenot/api/v1/?command=deleteListFromUser&wordListID=" + wordID + "&email=" + globalEmail);
   });
    hello();
};


var count = 0;
//location.reload();



refresh.addEventListener("click", function(){

  updateWordList();


});

function updateWordList(){
  chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
    globalEmail = decodeURIComponent(cookie.value);
    userIdentification.innerHTML = globalEmail;
    $('#list').empty();
    hello();
  });

}

//Block this Word
//var blockWordButton = document.getElementById('blockThis');
addWordButton.addEventListener("click", function(){
  //console.log(currentUserID);
  //userIdentification.innerHTML = currentUserEmail;
  blockWord();
  addWordTextArea.value = "";

  
  // loadListFunction();
});

function blockWord(){
    // Save it using the Chrome extension storage API.
    content = addWordTextArea.value;
    chrome.storage.sync.set({'value': content}, function() {
      // Notify that we saved.
      //message('Settings saved');
      chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
        //alert(cookie.content);
        globalEmail = decodeURIComponent(cookie.value);
        globalURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
        $.getJSON( globalURL, function( jsonData ) {
          var list;
          //alert(globalEmail);
          //alert(jsonData.lists[0]);
          var firstWordListID = jsonData.lists[0];
          var text = content;
          $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + firstWordListID + "&word[]=" + text);
          //alert("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + firstWordListID + "&word[]=" + text);
          //function1(content);

        });
      });
      hello();
      console.log(content);
      var text = content;
      $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=" + text);
      //here will also fill in the appropriate user id

      //function1(content);
    });
}

deleteWordButton.addEventListener("click", function(){
  //console.log(currentUserID);
  //userIdentification.innerHTML = currentUserEmail;
  deleteWord();
  deleteWordTextArea.value = "";
  //console.log("4");

  
  // loadListFunction();
});

function deleteWord(){
    content = deleteWordTextArea.value;
    chrome.storage.sync.set({'value': content}, function() {
      // Notify that we saved.
      //message('Settings saved');
      chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
        //alert(cookie.content);
        globalEmail = decodeURIComponent(cookie.value);
        globalURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
        $.getJSON( globalURL, function( jsonData ) {
          var list;
          //alert(globalEmail);
          //alert(jsonData.lists[0]);
          var firstWordListID = jsonData.lists[0];
          var text = content;
          $.post("http://104.131.2.125/spoilmenot/api/v1/?command=deleteWordFromList&wordListID=" + firstWordListID + "&word=" + text);
          //alert("http://104.131.2.125/spoilmenot/api/v1/?command=deleteWordFromList&wordListID=" + firstWordListID + "&word=" + text);
          //function1(content);
        });
      });
      hello();
      console.log(content);
      var text = content;
      $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=" + text);
      //here will also fill in the appropriate user id

      //function1(content);
    });
};


//Log Out Button Functionality
userLogoutButton.addEventListener("click", function(){
  $.post("http://104.131.2.125/spoilmenot/api/v1/", { command: "logout" }, function() {
      console.log("cookie deleted: success");

  }).done(function(){
    openNewPage('userPage', 'loginPage');

  });
  ;
})




//var addWordURL = "http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + currentUserID + "&word%5B%5D=" + addedWord;

//Update Button makes it such that the user's email is displayed
// var testingLabelButton = document.getElementById('testingLabel');
// testingLabelButton.addEventListener("click", function(){
//   console.log(currentUserID);
//   userIdentification.innerHTML = currentUserEmail;
//   updateUserList();
// });

function updateUserList(value) {
  $('#list').empty();
  loadListFunction();
}

var userWordList = "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID="; 

function loadListFunction(){
  //associate ID with account
    client.get(userWordList + currentUserID, function(response) {
      console.log(response);

      var userWordData = JSON.parse(response);
      //var currencyData = JSON.parse(response);
      //lastID = userData.lists[userData.lists.length-1].id;
      //console.log(lastID);
      console.log(userWordData.words.length-1);

      var wordCount = parseInt(userWordData.words.length-1);
      console.log(parseInt(userWordData.words.length-1));

      for (var i = 0, len = wordCount; i < len; i++){
        console.log(userWordData.words[i]);
        // $('#list').append('<li>'+userWordData.words[i]+'</li>');
        //updateUserList(userWordData.words[i]);
        
        $('#list').append('<li>'+'<span>'+ userWordData.words[i] + '</span>'+'</li>');
        //if delete is clicked, remove that word from the API Live
        

      }
  });

}

// function hello() {
//   console.log("hello");
//   chrome.runtime.sendMessage({
//       greeting: "hello"
//     },
//     function(response) {
//       var word;

//       for(word in response.msg){
//         //console.log("here?");
//         //var ul = document.getElementById("list");
//         //var li = document.createElement("li");
//         console.log(response.msg[word]);
//         var value = response.msg[word];
//         //$('#list').empty();
//         $('#list').append('<li>'+'<span>'+ value + '</span>'+'</li>');

//         //li.appendChild(document.createTextNode(value));
//         //ul.appendChild(li);
//         //document.getElementById("div").textContent = response.msg[word];

//       }
//     //  document.getElementById("div").textContent = response.msg;
//     });
// }



// function hello() {
//   $('#list').empty();
//   console.log("hello");
//   chrome.runtime.sendMessage({
//       greeting: "hello"
//     },
//     function(response) {
//       var word;

//       chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
//           // do something with the cookie
//           //console.log(cookie);
//           //alert(typeof(cookie.value));
//           globalEmail = decodeURIComponent(cookie.value);
//           //alert(cookie.name + ' found, value: ' + cookie.value);
//           globalURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
//           //alert(globalURL);

//         $.getJSON( globalURL, function( jsonData ) {
//           var list;
//           //alert(globalEmail);
//           for (list in jsonData.lists){
//             //alert(jsonData.lists[list]);
//             //for each of these i want to grab each list

//             $.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID="+jsonData.lists[list], function( jsonData1 ) {
//             var word;

//             for (word in jsonData1.words){
//               //alert(jsonData1.words[word])
//               //alert(jsonData1.words[word]);
//               //textChangeArr.push(jsonData1.words[word]);

//               //var ul = document.getElementById("divi");
//               //var li = document.createElement("li");
//               var value = jsonData1.words[word];
//               $('#list').append('<li>'+'<span>'+ value + '</span>'+'</li>');
//               //li.appendChild(document.createTextNode(value));
//               //ul.appendChild(li);
//             }
//            });
//           }
//          });

//       });

//     });
// }



function hello() {
  //$('#divi').empty();
  $('#list').empty();
  console.log("hello");
  chrome.runtime.sendMessage({
      greeting: "hello"
    },
    function(response) {
      var word;

      chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
          // do something with the cookie
          //console.log(cookie);
          //alert(typeof(cookie.value));
          globalEmail = decodeURIComponent(cookie.value);
          //alert(cookie.name + ' found, value: ' + cookie.value);
          globalURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
          //alert(globalURL);

        $.getJSON( globalURL, function( jsonData ) {
          var list;
          //alert(globalEmail);
          for (list in jsonData.lists){
            //alert(jsonData.lists[list]);
            //for each of these i want to grab each list

            $.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID="+jsonData.lists[list], function( jsonData1 ) {
            var word;

            for (word in jsonData1.words){
              //alert(jsonData1.words[word])
              //alert(jsonData1.words[word]);
              //textChangeArr.push(jsonData1.words[word]);

              //var ul = document.getElementById("divi");
              //var li = document.createElement("li");
              var value = jsonData1.words[word]
              $('#list').append('<li>'+'<span>'+ value + '</span>'+'</li>');
              //li.appendChild(document.createTextNode(value));
              //ul.appendChild(li);
            }
           });
          }
         });

      });

      // for(word in response.msg){
      //   console.log("here?");
      //   var ul = document.getElementById("divi");
      //   var li = document.createElement("li");
      //   console.log(response.msg[word]);
      //   var value = response.msg[word];
      //   li.appendChild(document.createTextNode(value));
      //   ul.appendChild(li);
      //   //document.getElementById("div").textContent = response.msg[word];

      // }
    //  document.getElementById("div").textContent = response.msg;
    });
}





//Delete Words from the list
//Block this Word
//var deleteWordButton = document.getElementById('deleteThis');


// function updateWords(){
//     // Save it using the Chrome extension storage API.
//     content = document.getElementById('userContent').value;
//     chrome.storage.sync.set({'value': content}, function() {
//       // Notify that we saved.
//       //message('Settings saved');
//       console.log(content);
//       var text = content;
//       $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + currentUserID + "&word[]=" + text);
//       //here will also fill in the appropriate user id
//       function1(content);
//     });
//     //function1(content);
// }

// function updateWords(){
//     // Save it using the Chrome extension storage API.
//     content = document.getElementById('userContent').value;
//     chrome.storage.sync.set({'value': content}, function() {

//       chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
//           // do something with the cookie
//           console.log(cookie);
//           //alert(typeof(cookie.value));
//           var globalEmail = decodeURIComponent(cookie.value);
//           //alert(cookie.name + ' found, value: ' + cookie.value);
//           var globalURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
//           console.log(globalURL);          
//           //alert(globalURL);

//         $.getJSON( globalURL, function( jsonData ) {
//           var list;
//           alert(globalEmail);
//           alert(jsonData.lists[0]);
//           var firstWordListID = jsonData.lists[0];
//           // Notify that we saved.
//           //message('Settings saved');
//           console.log(content);
//           var text = content;

//           $.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + firstWordListID + "&word[]=" + text);
//           alert("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=" + firstWordListID + "&word[]=" + text);
//           //here will also fill in the appropriate user id
//           function1(content);
//           });
//          });

//       });
//     }








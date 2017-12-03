// var textChangeArr = [];
// $.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID=40", function( jsonData ) {
//   var word;

//   for (word in jsonData.words){
//     textChangeArr.push(jsonData.words[word]);
//   }
//  });
var globalEmail = "";
var globalURL = "";
// var backgroundScriptMessage = " purple monkey dishwasher";
// chrome.extension.onRequest.addListener(function(request, sender)
// {
//  //alert("Background script has received a message from contentscript:'" + request.message + "'");
//  returnMessage(request.message);
// });
var textChangeArr = [];

chrome.cookies.get({url: "http://104.131.2.125/spoilmenot/api/v1", name: 'loggedIn'}, function(cookie) {
    // do something with the cookie
    console.log(cookie);
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
        textChangeArr.push(jsonData1.words[word]);
      }
     });
    }
   });

});



//always first list that is in there.
//alert(decodeURIComponent(globalEmail));
//getURL = "http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=" + globalEmail;
//alert(getURL);


var backgroundScriptMessage = " purple monkey dishwasher";
chrome.extension.onRequest.addListener(function(request, sender)
{
 //alert("Background script has received a message from contentscript:'" + request.message + "'");
 returnMessage(request.message);
});
//http://104.131.2.125/spoilmenot/api/v1/?command=getUserLists&email=ben@4trunnels.com






function returnMessage(messageToReturn)
{
 chrome.tabs.getSelected(null, function(tab) {
  var joinedMessage = messageToReturn + backgroundScriptMessage;
  //alert("Background script is sending a message to contentscript:'" + joinedMessage +"'");
  //chrome.tabs.sendMessage(tab.id, {message: joinedMessage});
  chrome.tabs.sendMessage(tab.id, {message: textChangeArr});

 });
}
 //
 // chrome.storage.sync.set({ "yourBody": "myBody" }, function(){
 //     //  A data saved callback omg so fancy
 // });


//Vihar's Part
//Interaction with Page Action Code
//https://stackoverflow.com/questions/13546778/how-to-communicate-between-popup-js-and-background-js-in-chrome-extension

/**
* Chrome Extension Bootstrap for Popup. Loads logic from Sandboxed HTML for eval-safe use into Popup.
* @event loadBoostrap
* @namespace backgroundPageController
**/

// chrome.extension.onConnect.addListener(function(port) {
//     console.log("Connected .....");
//     port.onMessage.addListener(function(msg) {
//         console.log("message recieved " + msg);
//         port.postMessage("Hi Popup.js");
//     });
// });

console.log("I am background.js");
//var content = document.getElementById('userContent').value;
var test;

//chrome.storage.sync.get('value', testing() );

// chrome.storage.onChanged.addListener(function(changes, sync){
//   console.log("whatup");
//   chrome.storage.sync.get({'value': test}, function(){
//     console.log(test);
//   })
// })



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello"){
    	sendResponse({
        	msg: textChangeArr
      	});
    }

  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	console.log(sender);
    if (request.greeting == "sendWordList"){
		//$.post("http://104.131.2.125/spoilmenot/api/v1/?command=addWordToList&wordListID=40&word[]=testing%20This");
    }

  });

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.greeting == "ready")
//       sendResponse({
//         msg: "set"
//       });

// });





//chrome.storage.onChanged.addListener(function(c))

//var content = document.getElementById('userContent').value;

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {

//     var chicken = request.greeting;
//     console.log(chicken);
//     //if (request.greeting == chicken)

//       sendResponse({
//         msg: chicken
//       });

//   });

//     pg.loadBootstrap = function() {
//       var iframe = document.getElementById("aiesec-frame");
//       var data = {
//         command: "render"
//       };

//       iframe.contentWindow.postMessage(data, "*");
//     };


//     var views = chrome.extension.getViews({
//     type: "popup"
// });
// for (var i = 0; i < views.length; i++) {
//     views[i].document.getElementById('x').innerHTML = "My Custom Value";
// }

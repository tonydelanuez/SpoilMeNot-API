var textChangeArr = [/Game of thrones/gi, /Jon Snow/gi, /gameofthrones/gi];
$.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getLists", function( json ) {
  //var obj = JSON.parse(json);
  //console.log(obj.lists.show_name);
  //console.log(obj.lists[1].show_name + " " + obj.lists[2].show_name);
  var item;
  for (item in json.lists){
    //console.log(json.lists[item].show_name);
    $.getJSON( "http://104.131.2.125/spoilmenot/api/v1/?command=getWords&wordListID="+json.lists[item].id, function( jsonData ) {
      //var obj = JSON.parse(json);
      //console.log(obj.lists.show_name);
      //console.log(obj.lists[1].show_name + " " + obj.lists[2].show_name);
      var word;

      for (word in jsonData.words){
        //console.log(jsonData.words[word]);
        //console.log("");
        //alert(jsonData.words[word]);
        //console.log("Actual word to block: " + "/" + jsonData.words[word] + "/gi");
        textChangeArr.push(jsonData.words[word]);// + "/gi");
      }
     });
  }
 });

var backgroundScriptMessage = " purple monkey dishwasher";
chrome.extension.onRequest.addListener(function(request, sender)
{
 //alert("Background script has received a message from contentscript:'" + request.message + "'");
 returnMessage(request.message);
});

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

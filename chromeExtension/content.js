//gets all of the elements on the page
var elements = document.getElementsByTagName('*');
var textChangeArr = [/Game of thrones/gi, /Jon Snow/gi, /gameofthrones/gi];

contentScriptMessage = "Skinner Said the teachers will crack any minute";


chrome.extension.sendRequest({message: contentScriptMessage});

chrome.runtime.onMessage.addListener(
 function(request, sender) {
  //alert("Contentscript has received a message from from background script: '" + request.message + "'");
  textChangeArr.push(request.message[5]);
  var word;
  for(word in request.message){
    var text = RegExp(request.message[word], "gi");
    console.log(text);
    textChangeArr.push(request.message[word]);
    //textChangeArr.push(text);

  }
  // alert(RegExp(request.message[5]));
  // alert(RegExp(request.message[5], gi));
  // alert(typeof(request.message[5]));
  // alert(textChangeArr);
  //alert(request.message[5]);
  });

setTimeout(function(){
  //alert(textChangeArr);

  for (var i = 0; i < elements.length; i++) {

      //grabs the individual div element etc.
      var element = elements[i];

      for (var j = 0; j < element.childNodes.length; j++) {

          //checks the children of that element
          var node = element.childNodes[j];

          //if the node is of type 3 which is text, then start to look to see if it should be replaced
          if (node.nodeType === 3) {
              var text = node.nodeValue;
              for(var k = 0; k < textChangeArr.length; k++){
                  var lookFor = textChangeArr[k];
                  //alert(typeof(textChangeArr[k]));
                  //console.log(lookFor);
                  //alert(typeof(lookFor));
                  //console.log(textChangeArr[k]);
                  var replacedText = text.replace(lookFor, function myFunction(x){
                    //console.log("should have replaced");

                  //in the function add a class name to the text nodes parent of blur text
                  console.log(node.parentElement.nodeName);
                  if(node.parentElement.nodeName == "EM"){
                    node.parentElement.parentElement.className += " blur-text";
                  }
                  node.parentElement.className += " blur-text";

                  //ignore certain tag elements
                  return x;
                  });
              }
          }
      }
  }
}, 10);

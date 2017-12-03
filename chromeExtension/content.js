//gets all of the elements on the page
var elements = document.getElementsByTagName('*');
var textChangeArr = [];

contentScriptMessage = "Skinner Said the teachers will crack any minute";


chrome.extension.sendRequest({message: contentScriptMessage});

chrome.runtime.onMessage.addListener(
 function(request, sender) {
  //alert("Contentscript has received a message from from background script: '" + request.message + "'");
  textChangeArr.push(request.message[5]);
  var word;
  for(word in request.message){
    var text = RegExp(request.message[word], "gi");
    //console.log(text);
    textChangeArr.push(text);
    //textChangeArr.push(text);
    console.log(textChangeArr[word]);

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
          // console.log(node.parentElement);
          // if(node.parentElement == "A"){
          //   console.log(node.Element);
          // }
          // if(node.attr == "img"){
          //   console.log("yay");
          // }


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
                  //console.log(node.parentElement.nodeName);
                    if(node.parentElement.nodeName == "EM" || node.parentElement.nodeName == "I" || node.parentElement.nodeName == "B"){
                      node.parentElement.parentElement.className += " blur-text";
                      node.parentElement.className += " blur-text";

                      //var attr = elmnt.getAttributeNode("class");

                      // console.log("delete em?");
                      // //b.parentNode.replaceChild(b.firstChild, b);
                      // console.log(node.parentElement);
                      // node.parentElement.removeAttribute("em");
                      // var elmnt = node.parentElement;
                      // var text = node;
                      // console.log(text);
                      // console.log(elmnt.parentNode.parentNode);
                      // elmnt.parentNode.parentNode.appendChild(text);
                      // console.log(elmnt.parentNode.parentNode);
                      //
                      // elmnt.parentNode.removeChild(elmnt);
                      // //console.log(elmnt.parentNode.parentNode);

                      //
                    }
                    else{
                      node.parentElement.className += " blur-text";
                    }

                  //ignore certain tag elements
                  return x;
                  });
              }
          }
      }
  }
}, 10);

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
        console.log(text.parentNode);
        console.log(text.parentElement);

    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
}

function doSomethingWithSelectedText() {
    var selectedText = selectHTML();

    if (selectedText) {
      //var mytext = selectHTML();

      //can iterate through selected text scanning for an italic or not

      $('unique-Span-Tag').css({"color":"black !important","text-shadow":"0 0 0px #000"});
      //$('unique-Span-Tag').addClass(" .unblur-text");




// "color":"black !important","text-shadow":"0 0 0px #000"});
//       "color": "transparent !important","text-shadow":"0 0 15px #000"});
//style="color:black !important; text-shadow:0 0 15px #000"
//style="color:black !important; text-shadow:0 0 0px #000 !important"

        console.log("Got selected text: " + selectedText);
        //console.log(selectedText.parentElement);
        //selectedText.parentElement.className += " test";
    }
}

function selectHTML() {
    try {
        if (window.ActiveXObject) {
            var c = document.selection.createRange();
            return c.htmlText;
        }

        var nNd = document.createElement("unique-Span-Tag");
        var w = getSelection().getRangeAt(0);
        w.surroundContents(nNd);
        return nNd.innerHTML;
    } catch (e) {
        if (window.ActiveXObject) {
            return document.selection.createRange();
        } else {
            return getSelection();
        }
    }
}


document.onmouseup = doSomethingWithSelectedText;

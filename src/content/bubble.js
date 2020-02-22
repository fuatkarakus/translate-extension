var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);
var globalSelection;
// Lets listen to mouseup DOM events. 
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if (selection) {
    if (selection.length >= 2) {
      // console.log("clientX: " + e.clientX + ", clientX: " + e.clientY);
      // console.log("selection : " + selection);
      renderBubble(e.pageX + 3, e.pageY + 3, selection);
      globalSelection = selection;
      console.log("selection :  " + globalSelection);
    }
  }
}, false);

// document.addEventListener('mousedown', function (e) {
//   console.log("mause down");
//   bubbleDOM.style.visibility = 'hidden';
// }, false);

document.querySelector('.selection_bubble').addEventListener('click', function(e) {
  chrome.runtime.sendMessage({action: 'openModal', selection: globalSelection});
  bubbleDOM.style.visibility = 'hidden';
  console.log("bubble selection: " + globalSelection);
}, false);

function clickHandler(){
  chrome.runtime.sendMessage({action: 'openModal'});
  bubbleDOM.style.visibility = 'hidden';
  console.log("clicked");
}

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  // bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}
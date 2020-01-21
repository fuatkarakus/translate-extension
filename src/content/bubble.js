var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

// Lets listen to mouseup DOM events. 
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if (selection) {
    if (selection.length >= 2) {
      // console.log("clientX: " + e.clientX + ", clientX: " + e.clientY);
      console.log("selection : " + selection);
      renderBubble(e.pageX + 3, e.pageY + 3, selection);
      console.log("content loaded");
      document.querySelector('.selection_bubble')
        .addEventListener('click', clickHandler, false);
    }
  }
}, false);

function clickHandler(){
  chrome.runtime.sendMessage({action: 'showModal'});
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
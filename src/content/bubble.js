// var bubbleDOM = document.createElement('div');
// bubbleDOM.setAttribute('class', 'selection_bubble');
// document.body.appendChild(bubbleDOM);

// // Lets listen to mouseup DOM events. 
// document.addEventListener('mouseup', function (e) {
//   var selection = window.getSelection().toString();
//   if (selection) {
//     if (selection.length >= 2) {
//       // console.log("clientX: " + e.clientX + ", clientX: " + e.clientY);
//       console.log("selection : " + selection);
//       renderBubble(e.pageX + 3, e.pageY + 3, selection);
//     }
//   }
// }, false);


// chrome.runtime.onMessage.addListener(function (message, sender, callback) {
//   if (message.url) {
//       console.log(message);
//       show_modal(message.url, message.fullscreen);
//   }
// });

// // Close the bubble when we click on the screen.
// document.addEventListener('mousedown', function (e) {
//   bubbleDOM.style.visibility = 'hidden';
// }, false);

// // Move that bubble to the appropriate location.
// function renderBubble(mouseX, mouseY, selection) {
//   // bubbleDOM.innerHTML = selection;
//   bubbleDOM.style.top = mouseY + 'px';
//   bubbleDOM.style.left = mouseX + 'px';
//   bubbleDOM.style.visibility = 'visible';
// }

// function show_modal(url, fullscreen = false) {
//   let agentMatch = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
//   let firefoxVersion = agentMatch ? parseInt(agentMatch[1]) : 0;

//   let tgt_model = firefoxVersion > 63
//       ? new Modal({url: url, fullscreen: fullscreen}, false)
//       : new ModalIframe({url: url, fullscreen: fullscreen}, false);

//   tgt_model.build().then(() => {
//       tgt_model.show();
//   });
// }
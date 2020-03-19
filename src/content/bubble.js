var bubbleDOM = document.createElement("div");
bubbleDOM.setAttribute("class", "selection_bubble");
document.body.appendChild(bubbleDOM);
var selection = "";
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}
document.addEventListener("mousedown", checkSelectionText);
document.addEventListener("mouseup", checkSelectionText);

function checkSelectionText(event) {
  if (event.target == document.querySelector(".selection_bubble")) {
    return;
  }

  setTimeout(function () {
    selection = getSelectionText();
    if (selection) {
      document.querySelector(".selection_bubble").style.top =
        event.pageY + 3 + "px";
      document.querySelector(".selection_bubble").style.left =
        event.pageX + 3 + "px";
      document.querySelector(".selection_bubble").style.visibility = "visible";
    } else {
      document.querySelector(".selection_bubble").style.visibility = "hidden";
    }
  });
}

document
  .querySelector(".selection_bubble")
  .addEventListener("click", openPopup);

function openPopup(event) {
  chrome.runtime.sendMessage({ action: "openModal", selection: selection });
  document.querySelector(".selection_bubble").style.visibility = "hidden";

  event.preventDefault();
  event.stopPropagation();
}

chrome.webRequest.onHeadersReceived.addListener(info => {
        let headers = info.responseHeaders.filter(header => {
                let name = header.name.toLowerCase();
                return name !== 'x-frame-options' && name !== 'frame-options';
            }
        );
        return {responseHeaders: headers};
    },
    {
        urls: [
            '*://translate.google.com/*',
            '*://translate.google.cn/*'
        ],
        types: ['sub_frame']
    },
    ['blocking', 'responseHeaders']
);

new Config(true, items => {

    let {pageLang, userLang, ttsLang, tpPageLang, tpUserLang, enableTT, enableTTS, enableTP} = items;

    chrome.contextMenus.removeAll(function () {
        // create Translate context menu
        console.log("(enableTTS)" + enableTTS);
        if (enableTT) {
            chrome.contextMenus.create({
                id: 'translate',
                // secimi cevir
                title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang, userLang]),
                contexts: ['selection']
            });
        }
        // create Listen context menu
        if (enableTTS) {
            chrome.contextMenus.create({
                id: 'tts',
                title: chrome.i18n.getMessage('contextMenuTitleTextToSpeech', ttsLang),
                contexts: ['selection']
            });
        }
        // create Translate Page context menu
        if (enableTP) {
            chrome.contextMenus.create({
                id: 'translatePage',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePage', [tpPageLang, tpUserLang]),
                contexts: ['all']
            });

            chrome.contextMenus.create({
                id: 'translatePageLink',
                title: chrome.i18n.getMessage('contextMenuTitleTranslatePageLink', [tpPageLang, tpUserLang]),
                contexts: ['link']
            });
        }
    });
});

browser.commands.onCommand.addListener(function (shortcut) {

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        let config = Config.config;

        if (shortcut === "translate" || shortcut === "tts") {
            chrome.tabs.executeScript({code: "window.getSelection().toString();"}, function (selection) {
                let selectedText = selection[0] || "";

                if (shortcut === "translate") {
                    openTranslate(config.translateURL + encodeURIComponent(selectedText), tab);
                } else if (shortcut === "tts") {
                    openTranslate(config.ttsURL + encodeURIComponent(selectedText) + '&textlen=' + selectedText.length, tab);
                }
            });
        } else if (shortcut === "translatePage") {
            openTranslate(config.translatePageURL + encodeURIComponent(tab.url), tab, true);
        }
    });
});

// manage click context menu
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    let selectedText = info.selectionText;
    let config = Config.config;

    switch (info.menuItemId) {
        case 'translate':
            openTranslate(config.translateURL + encodeURIComponent(selectedText), tab);
            break;
        case  'tts':
            openTranslate(config.ttsURL + encodeURIComponent(selectedText) + '&textlen=' + selectedText.length, tab);
            break;
        case 'translatePage':
            openTranslate(config.translatePageURL + encodeURIComponent(info.pageUrl), tab, true);
            break;
        case 'translatePageLink':
            openTranslate(config.translatePageURL + encodeURIComponent(info.linkUrl), tab, true);
            break;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'newTab') {
        chrome.tabs.create({url: request.url});
    }
});

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

function openTranslate(url, tab, fullscreen = false) {
    if (Config.config.openMode === "modal") {
        chrome.tabs.sendMessage(tab.id, {
            url: url,
            fullscreen: fullscreen
        });
    } else {
        tabCreateWithOpenerTabId(url, tab);
    }
}

// Create a tab with openerTabId if version of Firefox is above 57
// https://github.com/itsecurityco/to-google-translate/pull/19
function tabCreateWithOpenerTabId(uri, tab) {
    browser.runtime.getBrowserInfo().then(info => {
        let newTabConfig = {
            url: uri
        };
        if (Math.round(parseInt(info.version)) > 56) {
            // openerTabId supported
            newTabConfig.openerTabId = tab.id;
        }
        chrome.tabs.create(newTabConfig);
    });
}

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
    }
  }
}, false);
window.addEventListener('load', function () {
    let selectedText = info.selectionText;
    let config = Config.config;
    var link = document.getElementsByClassName('selection_bubble');
    link.addEventListener('click', function(e) {
        console.log("icon clicked");
        openTranslate(config.translateURL + encodeURIComponent(selectedText), tab);
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  if (message.url) {
      console.log(message);
      show_modal(message.url, message.fullscreen);
  }
});

// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  // bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}

function show_modal(url, fullscreen = false) {
  let agentMatch = window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);
  let firefoxVersion = agentMatch ? parseInt(agentMatch[1]) : 0;

  let tgt_model = firefoxVersion > 63
      ? new Modal({url: url, fullscreen: fullscreen}, false)
      : new ModalIframe({url: url, fullscreen: fullscreen}, false);

  tgt_model.build().then(() => {
      tgt_model.show();
  });
}
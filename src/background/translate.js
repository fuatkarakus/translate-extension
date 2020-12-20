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
    if (request.action === 'openModal') {
        console.log(" action -->  : " +request.selection);
        let tab = sender.tab;
        let config = Config.config;
        let selectionText = request.selection;
        openTranslate(config.translateURL + encodeURIComponent(selectionText), tab);
    }
});

chrome.runtime.onInstalled.addListener(function (info) {
    if (info.reason === "install") {
        chrome.runtime.openOptionsPage();
    }
});

function openTranslate(url, tab, fullscreen = false) {
    if (Config.config.openMode === "modal") {
        console.log( "open url ---> ", url);
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
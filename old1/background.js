const URL_PATTERN = 'http://www.utic.go.kr/*';
const PARENT_CONTEXT_ID = 'markDownloadedParent';
const MESSAGE_TO_MARK = 'markClipId'

const sendMessage = options => {
    const {type, ids, message} = options;
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.query({url:[URL_PATTERN]}, function(tabs) {
        tabs.forEach(tab => {
            console.log(tab);
            chrome.tabs.sendMessage(tab.id, {type, ids, message})
        })
    });
}

function debounce(callback, limit = 100) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            // console.log('debounced callback called(refresh marker)');
            callback.apply(this, args)
        }, limit)
    }
}

const onClickHandlerContext  = async (info, tab) => {
    console.log(info, tab)
}

chrome.contextMenus.onClicked.addListener(onClickHandlerContext);

console.log('background outer start!');

// when browser connects utic, popup.html activate
chrome.runtime.onInstalled.addListener(function() {
    // show popup.html 
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'www.utic.go.kr'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

});

const showHLSUrl = (url) => {
    console.log(url)
}

const findHLSUrl = (details) => {
    console.log(details);
    const UTIS_URL = 'http://www.utic.go.kr';
    const manifestUrl = /.*playlist.m3u8.*/;
    if(details.initiator !== UTIS_URL){
        // console.log('do not refresh because web request is not for utic');
        return
    }
    if(manifestUrl.test(details.url)){
        // console.log('do not refresh because web request is HLS request');
        showHLSUrl(details.url);
    }
}

const captureHLSUrl = (href, callback) => {
    return (details) => {
        const UTIS_URL = 'http://www.utic.go.kr';
        const manifestUrl = /.*playlist.m3u8.*/;
        if(details.initiator !== UTIS_URL){
            // console.log('do not refresh because web request is not for utic');
            return
        }
        if(manifestUrl.test(details.url)){
            // console.log('do not refresh because web request is HLS request');
            // showHLSUrl(details.url);
            callback(href, details.url);
        }
    }
}

//when any tab connects target, attach webRequest Listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo, tab);
    // const captureRegExp = /http.*newsroom.*/;
    // if(changeInfo.status !== 'complete' || !(captureRegExp.test(tab.url))){
    //     return;
    // }
    // console.log('attach webRequest complete listener!!')
    // chrome.webRequest.onCompleted.addListener(fireRefresh ,{urls: ['<all_urls>']});
})

// chrome.webRequest.onCompleted.addListener(findHLSUrl ,{urls: ['<all_urls>']});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // if content script send refreshMenu command..
        if (request.type == "ping"){
            console.log('received ping');
            sendMessage({type:"alive", message: "pong"});
        }
        if (request.type == "hrefClicked"){
            console.log('href clicked');
            console.log(request.message, request.href);
            const callback = captureHLSUrl(request.href, (cctvId, url) => {
                chrome.webRequest.onCompleted.removeListener(callback);
                console.log(cctvId, "=", url);
            });
            chrome.webRequest.onCompleted.addListener(callback ,{urls: ['<all_urls>']});
        }
    }
);
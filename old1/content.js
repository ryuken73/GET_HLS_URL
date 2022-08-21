const URL_PATTERN = 'https://newsroom.ap.org/*';

const getElementByClipId = clipId => {
    const xpath = document.evaluate(`//p[contains(., '${clipId}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return xpath.snapshotItem(0);

}

function debounce(callback, limit = 100) {
    let timeout
    return function(...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            console.log('got message processed. debounced callback called(mark elements)');
            callback.apply(this, args)
        }, limit)
    }
}

const startLoading = element => {
    element.style.background = "red";
    element.innerHTML = "Marking...";
}

const endLoading = (element, count) => {
    element.style.background = "black";
    element.innerHTML = `Marked[${count}]`;
}

const uniq = array => {
    const uniqSet = new Set(array);
    return uniqSet.size;
}

const handleAliveMessage = (request) => {
    console.log(request.message);
}

const handlers = {
    'alive': handleAliveMessage
}

const clickedElements = [];
const clickHandler = event => {
    console.log('href clicked:', event);
    const targetElement = event.target;
    const href = targetElement.href;
    chrome.runtime.sendMessage({type:'hrefClicked', message:targetElement, href})
}

const TIME_OUT=3000;
const main = () => {
    console.log('dom ready! main start!');
    if(typeof initLoading === 'undefined'){
        const initLoading = () => {
            const tableElement = document.getElementById('cctvListTb');
            tableElement.addEventListener('click', clickHandler)
            // // prevent background service-worker becoming inactive status.
            // // (in inactive status, webRequest not captured)
            setInterval(() => {
                chrome.runtime.sendMessage({type:'ping'});
            },5000)
        }
        initLoading()
    }
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log('got message')
            const handler = handlers[request.type];
            handler(request, sender, sendResponse)
        }
    )
}

// const s = document.createElement('script');
// s.src = chrome.runtime.getURL('inject.js');
// s.onload = function() {
//     this.remove();
// };
// (document.head || document.documentElement).appendChild(s);

// const waitDomLoad = setInterval(() => {
//     if(document.getElementById('cctvListTb') !== undefined) {
//         clearInterval(waitDomLoad);
//         main()
//     } 
// },1000)

main();
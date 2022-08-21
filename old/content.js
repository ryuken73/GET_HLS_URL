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

const handleMarkClipId = (request, sender, sendResponse, element) => {
    // console.log(request.ids)
    const injectedElement = document.getElementById('markerLoadingSBS')
    startLoading(injectedElement);
    let marked = [];
    request.ids.forEach(([id, exists]) => {
        const targetElement = getElementByClipId(id);
        if(targetElement !== null){
            // console.log(`change background of ${id} exists=${exists}`, targetElement)
            const bgColor = exists ? 'yellow':'red';
            targetElement.style.background = bgColor;
            marked.push(id);
        }
    })
    setTimeout(() => {
        endLoading(injectedElement, uniq(marked));
    },500)
    sendResponse({farewell:'goodbye'})
}

const markClipDebounced = debounce(handleMarkClipId, 500);
const handleAliveMessage = (request) => {
    console.log(request.message);
}

const handlers = {
    'markClipId': markClipDebounced,
    'alive': handleAliveMessage
}

const TIME_OUT=3000;
const main = () => {
    console.log('dom ready! main start!');
    if(typeof initLoading === 'undefined'){
        const initLoading = () => {
            const links = document.links;
            const linksArray = Object.values(links);
            const cctvLinks = linksArray.filter(link => link.href.startsWith('javascript:test'))
            clickAllLinks(cctvLinks, TIME_OUT)
            for(let cctvLink of cctvLinks){
                attachFindButton(cctvLink);
            }

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
            handler(request, sender, sendResponse, injectElement);
        }
    )
}

const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

const waitDomLoad = setInterval(() => {
    if(document.getElementById('cctvListTb') !== undefined) {
        clearInterval(waitDomLoad);
        // main()
    } 
},1000)
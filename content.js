
const handleAliveMessage = (request) => {
    console.log(request.message);
}

const handlers = {
    'alive': handleAliveMessage
}

const clickHandler = event => {
    console.log('href clicked:', event);
    const targetElement = event.target;
    const href = targetElement.href;
    chrome.runtime.sendMessage({type:'hrefClicked', message:targetElement, href}, (response) => {
        if(chrome.runtime.lastError){
            console.log('Error Receive hrefClicked:', chrome.runtime.lastError);
            return;
        }
        const {cctvId, url} = response;
        console.log(targetElement, targetElement.parentElement, targetElement.parentElement.parentElement);
        const targetRowElement = targetElement.parentElement.parentElement;
        const capturedElement = targetRowElement.querySelector('#captured');
        if(capturedElement){
            capturedElement.innerHTML = `[${cctvId}] ${url} `;
            return
        }
        const newCapturedElement = document.createElement('div');
        newCapturedElement.id = 'captured';
        newCapturedElement.innerHTML = `[${cctvId}] ${url} `;
        newCapturedElement.style.width = '600px';
        newCapturedElement.style.overflow = 'hidden';
        newCapturedElement.style.textOverflow = 'ellipsis';
        newCapturedElement.style.whiteSpace = 'nowrap';
        newCapturedElement.style.fontSize = '12px';

        targetRowElement.appendChild(newCapturedElement);
    })
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
                console.log('send ping');
                if(!chrome.runtime?.id){
                    console.log('extension invalidated. failed send ping!');
                    return;
                }
                chrome.runtime.sendMessage({type:'ping'}, (response) => {
                    if(chrome.runtime.lastError){
                        console.log('Error Receive pong:', chrome.runtime.lastError);
                        return;
                    }
                    console.log(response.message);
                });
            },5000)
        }
        initLoading()
    }
}

const s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('got message')
        const handler = handlers[request.type];
        handler(request, sender, sendResponse)
    }
)

main();
console.log('dom ready! main start!');

const clickElement = async (link, timeout=5000) => {
    return new Promise((resolve, reject) => {
        link.click();
        setTimeout(() => {
            resolve();
        }, timeout);
    })
}
const runAll = async (links, timeout=5000) => {
    for await (let link of links){
            const result = await clickElement(link, timeout);
            console.log(result)
        }
}

const attachFindButton = (cctvLink) => {
    // const event = new MouseEvent('click');
    const buttonElement = document.createElement('button');
    buttonElement.innerHTML = "Get Url"
    buttonElement.addEventListener('click', () => cctvLink.click());
    const grandParentElement = cctvLink.parentElement.parentElement;
    grandParentElement.appendChild(buttonElement);
    console.log('### attached button:', cctvLink.innerHTML);
};

const attachCheckAllButton = () => {
    const button = document.createElement('button');
    button.innerText = 'Run All';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.onclick = () => {
        const links = document.links;
        const linksArray = Object.values(links);
        const allCCTVLinks = linksArray.filter(link => link.href.startsWith('javascript:test'))
        runAll(allCCTVLinks);

    }
    document.body.appendChild(button);

}

if(typeof initLoading === 'undefined'){
    const initLoading = async () => {
        attachCheckAllButton();
        // const links = document.links;
        // const linksArray = Object.values(links);
        // const allCCTVLinks = linksArray.filter(link => link.href.startsWith('javascript:test'))
        // clickAllLinks(cctvLinks, 3000);
        // for(let cctvLink of cctvLinks){
        //     attachFindButton(cctvLink);
        // }
    }
    initLoading()
}
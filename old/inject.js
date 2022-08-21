console.log('dom ready! main start!');

const clickElement = async (link) => {
    return new Promise((resolve, reject) => {
        link.click();
        setTimeout(() => {

        })
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

if(typeof initLoading === 'undefined'){
    const initLoading = () => {
        const links = document.links;
        const linksArray = Object.values(links);
        const cctvLinks = linksArray.filter(link => link.href.startsWith('javascript:test'))
        for await (let link of cctvLinks){
            const result = await clickElement(link);
            console.log(result)
        }
        // clickAllLinks(cctvLinks, 3000);
        // for(let cctvLink of cctvLinks){
        //     attachFindButton(cctvLink);
        // }
    }
    initLoading()
}
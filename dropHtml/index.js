const handleDragover = ev => {
    console.log(`dragOver: dropEffect = ${ev.dataTransfer.dropEffect} ; effectAllowed = ${ev.dataTransfer.effectAllowed}`);
    ev.preventDefault();
    // Set the dropEffect to move
    // ev.dataTransfer.dropEffect = "move"
}
const handleDrop = ev => {
    console.log(`drop: dropEffect = ${ev.dataTransfer.dropEffect} ; effectAllowed = ${ev.dataTransfer.effectAllowed}`);
    ev.preventDefault();
    console.log(ev.dataTransfer.getData('application/json'))
    // ev.target.innerHTML = JSON.parse(ev.dataTransfer.getData('application/json'));
};
const handleDragstart = ev => {
    ev.dataTransfer.setData('text', 'ryuken');
}

const dragZone = document.getElementById('dragZone');
dragZone.addEventListener('dragstart', handleDragstart);


const dropZone = document.getElementById('dropZone');
dropZone.addEventListener('dragover', handleDragover);
dropZone.addEventListener('drop', handleDrop);
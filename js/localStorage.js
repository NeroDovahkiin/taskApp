


// add the global array of taskGroup elements to the localStorage
function addLocalStorage(arrayGroups) {
    arrayGroups.forEach((element, index) => {
        localStorage.setItem(index, JSON.stringify(element));
    });
}

function loadLocalStorage() {
    for (var x = 0; x < localStorage.length; x++) {

        // get Object data from localStorage
        const tg = JSON.parse(localStorage.getItem(localStorage.key(x)));

        // parse object to class taskGroup
        const taskGroupX = new taskGroup(tg.taskGroupName);
        taskGroupX.setTasks(tg.tasks);

        taskGroups.push(taskGroupX);
    }
}
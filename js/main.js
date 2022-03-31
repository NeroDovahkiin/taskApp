"use strict";

const taskGroups = [];

// cargo los datos del localStorage
loadLocalStorage();

const colors = ["tomato", "Aquamarine", "blue", "Brown", "Chartreuse", "CornFlowerBlue", "DarkSlateBlue", "DarkTurquoise", "DodgerBlue", "Gray", "GreenYellow", "DarkSlateGray", "Gold", "FireBrick", "Indigo", "Salmon", "SeaGreen"];

window.onload = function () {

    const btnNewTaskGroup = document.getElementById('btnAddNewTaskGroup');
    const nameOfTaskGroup = document.getElementById('txtGroupName');

    btnNewTaskGroup.onclick = () => {
        if (nameOfTaskGroup.value != "") {
            // agrego el objeto taskGroup al array global de tareas
            taskGroups.push(new taskGroup(nameOfTaskGroup.value));
            // llamo a actualizar el localStorage
            addLocalStorage(taskGroups);

            // obtengo posicion del ultimo grupo agregado, this
            const pos = taskGroups.length - 1;
            console.log(pos);

            createVisualTaskGroup(nameOfTaskGroup.value, pos);
            nameOfTaskGroup.value = "";
        } else {

            SnackBar({
                message: "You must enter a name...",
                status: "info",
                position: "bc",
                icon: "warn"
            });
        }
    }

    nameOfTaskGroup.onkeydown = (e) => {
        if (e.key == "Enter") {
            btnNewTaskGroup.click();
        }
    }
};

const createVisualTaskGroup = (name, index) => {

    const divPrincipal = document.getElementById('container');

    const visualGroupTask = document.createElement("div");
    visualGroupTask.setAttribute("id", "groupTask-" + index);
    visualGroupTask.setAttribute("class", "groupTask");
    visualGroupTask.innerHTML = `
    <div class="headerTask" style="background-color: ${getRandomColor()}">
     <h3> ${name} <span class="btnDeleteGroup" onclick="deleteGroupTask(this)"><i class="fas fa-trash-alt"></i></span></h3>
        <div>
            <input type="text" id="text-${index}">
            <div onclick="addVisualTask(this)" class="button_slide2 slide_right"> ADD </div>
        </div>
    </div>
    <div class="bodyTask">
    </div>
    `;

    divPrincipal.appendChild(visualGroupTask);

    //actualizo localStorage
    localStorage.clear();
    addLocalStorage(taskGroups);

    // AGREGO EL EVENTO ENTER AL INPUT TEXT
    const textBox = document.getElementById("text-" + index);
    // evento Enter agregar tarea
    textBox.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
            addVisualTask(e.target.nextElementSibling);
        }
    }
    );

}

function deleteGroupTask(e) {

    if (window.confirm("Do you really want to remove this taskGroup?")) {
        const idFather = e.parentElement.parentElement.parentElement.getAttribute("id");
        const id = idFather.slice(idFather.lastIndexOf("-") + 1);
        taskGroups.splice(id, 1);

        //actualizo localStorage
        localStorage.clear();
        addLocalStorage(taskGroups);

        // Eliminar el grupo visual
        document.getElementById("container").removeChild(document.getElementById("groupTask-" + id));
    }
}


// el parametro hardCodeNameTask es opcional, usado cuando creo manualmente la tarea, el tercer parametro tambien es opcional
const addVisualTask = (e, hardCodeNameTask, completed) => {
    // e es el objeto que llamo a la funcion, porque lo pase como parametro al llamarla

    // obtengo el elemento input hermano superior
    const taskDescription = e.previousElementSibling;
    let taskText = taskDescription.value;

    // obtengo el id que tiene el indicador numérico correspondiente a este grupo de tareas
    const idTarget = taskDescription.getAttribute("id");
    // obtengo solo el id del string
    const idGroupTask = idTarget.slice(idTarget.lastIndexOf("-") + 1);
    //console.log(idGroupTask);

    // obtengo el div padre, que es el groupTask
    const targetGroupTask = e.parentElement.parentElement.parentElement;

    if (hardCodeNameTask == undefined) {

        // agrego la tarea al array de tareas del objeto GroupTask
        taskGroups[parseInt(idGroupTask)].addTask(taskDescription.value);
        if (taskText == "") {
            SnackBar({
                message: "You must enter a name...",
                status: "info",
                position: "bc",
                icon: "warn"
            });
            return;
        }
    } else {
        taskText = hardCodeNameTask;
    }

    // obtengo el div que contiene a las tareas
    const bodyGroup = targetGroupTask.getElementsByClassName('bodyTask')[0];

    if (targetGroupTask != null) {

        const task = document.createElement("div");

        task.setAttribute("class", "task");

        task.innerHTML = `
             <input type="checkbox" class="cbkTask">
             <label>${taskText}</label>
             <div class="deleteBtn">
                <span style="padding-right: 8px;"><i class="far fa-edit"></i></span>
                <span class="deleteBtn"><i class="fas fa-trash-alt"></i></span>
            </div>
         `;

        bodyGroup.appendChild(task);

        if (completed) {
            task.firstElementChild.click();
            task.setAttribute("class", "task finishedTask");
        }

        //actualizo localStorage
        localStorage.clear();
        addLocalStorage(taskGroups);

        // ----------- TACHADO DEL TEXTO --------------

        // obtener ultimo elemento task
        const checkTask = bodyGroup.lastChild.firstElementChild;

        // agrego clase "tachado" al texto
        checkTask.addEventListener("change", function () {
            const texto = this.nextElementSibling;

            // cuento cuantas task hacia arriba tiene para obtener la posicion
            let taskToComplete = this.parentElement;
            let i = 0;
            while (taskToComplete.previousElementSibling != null) {
                taskToComplete = taskToComplete.previousElementSibling;
                i++;
            }
            //console.log(i);
            // obtengo el string id del groupTask
            const stringGroupTask = this.parentNode.parentNode.parentNode.getAttribute("id");

            // obtengo solo el id del string
            const idGroupTask = stringGroupTask.slice(stringGroupTask.lastIndexOf("-") + 1);
            //console.log(idGroupTask);
            taskGroups[idGroupTask].completeTask(i);

            //actualizo localStorage
            localStorage.clear();
            addLocalStorage(taskGroups);

            if (this.checked == true) {
                texto.classList.add("strikethrough");
                // fondo a la tarea completada
                this.parentElement.classList.add("finishedTask");
            } else {
                texto.classList.remove("strikethrough");
                this.parentElement.classList.remove("finishedTask");
            }
        });

        // obtengo el span con clase deleteBtn y le agrego el evento eliminar
        const deleteBtn = bodyGroup.lastChild.lastElementChild.lastElementChild;

        deleteBtn.addEventListener("click", function () {

            // cuento cuantas task hacia arriba tiene para obtener la posicion
            let taskToDelete = this.parentElement.parentElement;
            let i = 0;
            while (taskToDelete.previousElementSibling != null) {
                taskToDelete = taskToDelete.previousElementSibling;
                i++;
            }

            // obtengo el string id del groupTask
            const stringGroupTask = this.parentNode.parentNode.parentNode.parentNode.getAttribute("id");

            // obtengo solo el id del string
            const idGroupTask = stringGroupTask.slice(stringGroupTask.lastIndexOf("-") + 1);

            taskGroups[parseInt(idGroupTask)].deleteTask(i);

            //actualizo localStorage
            localStorage.clear();
            addLocalStorage(taskGroups);

            // elimino la task del dom
            bodyGroup.removeChild(this.parentElement.parentElement);
        });

        // vacio el input text
        taskDescription.value = "";

    } else {
        console.log("Error on delete");
    }
}

//----------------------------------------------------------------------------------------------------
// Retorna un entero aleatorio entre min (incluido) y max (excluido)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
    return colors[getRandomInt(0, colors.length)];
}
//----------------------------------------------------------------------------------------------------

// creo los grupos en pantalla a partir del localStorage
function loadVisualGroups() {
    taskGroups.forEach((e, index) => {
        createVisualTaskGroup(e.taskGroupName, index);
        // obtengo el boton de este taskgroup para ejecutar el evento click que crea tareas en este grupo
        const btnTarget = document.getElementById("text-" + index).parentElement.lastElementChild;

        e.tasks.forEach(i => {
            if (i.name != undefined) {
                addVisualTask(btnTarget, i.name, i.completed);
            }
        });
    });
}

// dibujo los grupos de tarea a partir del localStorage
loadVisualGroups();





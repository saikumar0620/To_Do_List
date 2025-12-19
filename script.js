
const taskFormInput = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const tasksContainer = document.querySelector(".tasksContainer");


let TODOS = [];

document.addEventListener("DOMContentLoaded", function () {
    const areTodosLoaded = loadTodos()
    // console.log(areTodosLoaded)
    if (areTodosLoaded) {

        renderTodos(TODOS)
    }
})

function loadTodos() {
    const todoArr = JSON.parse(localStorage.getItem("todo"))
    if (todoArr && todoArr.length) {
        TODOS = todoArr
        return true;
    }
    return false;
}

function renderTodos(todos) {
    for (let i = 0; i < todos.length; i++) {
        createAndPushNewTask(todos[i])
    }
}

// function displyTasks(tasks){
//       const pTag = document.createElement("p");
//     pTag.setAttribute("class", "task");
//     // const newTask = taskInput.value;
//     pTag.textContent = tasks;
//     tasksContainer.appendChild(pTag)
// }

function savedToLocal(todos) {
    localStorage.setItem("todo", JSON.stringify(todos))

}

function handletaskdelete(taskIdToDelete) {
    const userConformation = confirm("are you sure want to delete")
    if (userConformation) {
        //   console.log(taskIdToDelete)
        TODOS = TODOS.filter((task) => task.taskId != taskIdToDelete);
        localStorage.setItem("todo", JSON.stringify(TODOS));
        const listItemTobeRemoved = document.getElementById(taskIdToDelete)
        listItemTobeRemoved.remove()
    }


}

function handleTaskCheckBox(checkId) {
    for (let i = 0; i < TODOS.length; i++) {
        if (TODOS[i].taskId == checkId) {
            TODOS[i].isTaskDone = !TODOS[i].isTaskDone;
        }
    }
    localStorage.setItem("todo", JSON.stringify(TODOS));
}

function handleTaskEdit(taskId) {
    let taskToEdit = null;

    for (let i = 0; i < TODOS.length; i++) {
        if (TODOS[i].taskId === taskId) {
            taskToEdit = TODOS[i];
            break;
        }
    }

    // 2. Ask user for new task text
    const newTaskText = prompt("Edit your task:", taskToEdit.taskText);

    // If user clicks cancel or enters empty text
    if (newTaskText === null || newTaskText.trim() === "") {
        console.log("hi")
        return;
    }

    // 3. Update task text in object
    taskToEdit.taskText = newTaskText;

    // 4. Update DOM text
    const listItem = document.getElementById(taskId);
    const taskParagraph = listItem.querySelector(".task");
    taskParagraph.textContent = newTaskText;

    // 5. Save updated array to localStorage
    localStorage.setItem("todo", JSON.stringify(TODOS));
}


function createAndPushNewTask(task) {
    const newlistItem = document.createElement("li");
    newlistItem.setAttribute("class", "taskLiItem");
    newlistItem.setAttribute("id", task.taskId);

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = task.isTaskDone
    checkBox.addEventListener("change", function () {
        handleTaskCheckBox(task.taskId)
    })

    const tasksContentContainer = document.createElement("div");

    const tasksTextpTag = document.createElement("p");
    tasksTextpTag.setAttribute("class", "task")

    tasksTextpTag.textContent = task.taskText;

    const timeStamppTag = document.createElement("p");
    // timeStamppTag.setAttribute("class",)
    timeStamppTag.textContent = task.timeStamp;

    //ptags push into contentcontainer div
    tasksContentContainer.appendChild(tasksTextpTag);
    tasksContentContainer.appendChild(timeStamppTag);

    const tasksActionsContainer = document.createElement("div")
    const editButton = document.createElement("button")
    editButton.textContent = "edit"
    editButton.addEventListener("click", function () {
        handleTaskEdit(task.taskId)

    });


    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.addEventListener("click", function () {
        handletaskdelete(task.taskId)
    });


    tasksActionsContainer.appendChild(editButton);
    tasksActionsContainer.appendChild(deleteButton);


    newlistItem.appendChild(checkBox);
    newlistItem.appendChild(tasksContentContainer);
    newlistItem.appendChild(tasksActionsContainer);

    tasksContainer.appendChild(newlistItem);


}



taskFormInput.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("hello")
    const newTask = {
        taskId: Date.now(),
        taskText: taskInput.value,
        isTaskDone: false,
        timeStamp: new Date(),
    }


    createAndPushNewTask(newTask)
    TODOS.push(newTask)
    savedToLocal(TODOS)



})































document.addEventListener("DOMContentLoaded", init)
function init(){

const taskError = document.getElementById("taskError");
const taskFormInput = document.querySelector(".taskForm");
const taskInput = document.querySelector(".taskInput");
const tasksContainer = document.querySelector(".tasksContainer");
const sort = document.getElementById("sort");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");

let TODOS = [];


 const areTodosLoaded = loadTodos();
    if (areTodosLoaded) {
        clearTasksUI();
        renderTodos(TODOS);
        updateTaskCounts();
    }

function loadTodos() {
    const todoArr = JSON.parse(localStorage.getItem("todos"));
    if (todoArr && todoArr.length) {
        TODOS = todoArr;
        return true;
    }
    return false;
}

function renderTodos(todos) {
    for (let i = 0; i < todos.length; i++) {
        createAndPushNewTask(todos[i]);
    }
}

function savedToLocal(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function handletaskdelete(taskIdToDelete) {
    const userConformation = confirm("are you sure sai you want to delete this");
    if (userConformation) {
        TODOS = TODOS.filter((task) => task.taskId != taskIdToDelete);
        savedToLocal(TODOS);
        const listItemTobeRemoved = document.getElementById(taskIdToDelete);
        listItemTobeRemoved.remove();
        updateTaskCounts();
    }
}

//check box handling 
function handleTaskCheckBox(checkId) {
    const listItem = document.getElementById(checkId);
    const para = listItem.querySelector(".task");

    for (let i = 0; i < TODOS.length; i++) {
        if (TODOS[i].taskId == checkId) {
            TODOS[i].isTaskDone = !TODOS[i].isTaskDone;
            para.classList.toggle("strike");
        }
    }
    savedToLocal(TODOS);
    updateTaskCounts();
}

//edit tasks
function handleTaskEdit(taskId) {
    let taskToEdit = null;

    for (let i = 0; i < TODOS.length; i++) {
        if (TODOS[i].taskId === taskId) {
            taskToEdit = TODOS[i];
            break;
        }
    }

    const newTaskText = prompt("Edit your task here", taskToEdit.taskText);

    if (newTaskText === null || newTaskText.trim() === "") {
        return;
    }

    taskToEdit.taskText = newTaskText;
    const listItem = document.getElementById(taskId);
    const taskParagraph = listItem.querySelector(".task");
    taskParagraph.textContent = newTaskText;

    savedToLocal(TODOS);
    updateTaskCounts();
}




// inside UI clr tasks
function clearTasksUI() {
    const elementsToKeep = [sort, clearCompletedBtn, document.querySelector(".taskCounts")];
    tasksContainer.innerHTML = "";
    elementsToKeep.forEach(el => tasksContainer.appendChild(el));
}

//this is for drop down selection for sorting
sort.addEventListener("change", function () {
    const sortValue = sort.value;

    if (sortValue === "new") {
        TODOS.sort((a, b) => b.taskId - a.taskId);
    }

    if (sortValue === "old") {
        TODOS.sort((a, b) => a.taskId - b.taskId);
    }

    if (sortValue === "pending") {
        TODOS.sort((a, b) => a.isTaskDone - b.isTaskDone);
    }

    clearTasksUI();
    renderTodos(TODOS);
    savedToLocal(TODOS);
});

clearCompletedBtn.addEventListener("click", function () {
    const userConfirmation = confirm("Clear all completed tasks?");
    if (!userConfirmation) return;

    TODOS = TODOS.filter(task => task.isTaskDone === false);
    savedToLocal(TODOS);

    clearTasksUI();
    renderTodos(TODOS);
    updateTaskCounts();
});

function updateTaskCounts() {
    const totalTasks = TODOS.length;
    const completedTasks = TODOS.filter(task => task.isTaskDone).length;

    totalCount.textContent = "Total:" + totalTasks;
    completedCount.textContent = "Completed:" + completedTasks;
}

function formatTimestamp(isoString) {
    const taskDate = new Date(isoString);
    const now = new Date();

    const isToday =
        taskDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        taskDate.toDateString() === yesterday.toDateString();

    const time = taskDate.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    if (isToday) {
        return `Today, ${time}`;
    }

    if (isYesterday) {
        return `Yesterday, ${time}`;
    }

    return taskDate.toLocaleDateString() + ", " + time;
}




function createAndPushNewTask(task) {
    const newlistItem = document.createElement("li");
    newlistItem.setAttribute("class", "taskLiItem");
    newlistItem.setAttribute("id", task.taskId);

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = task.isTaskDone;

    checkBox.addEventListener("change", function () {
        handleTaskCheckBox(task.taskId);
    });

    const tasksContentContainer = document.createElement("div");

    const tasksTextpTag = document.createElement("p");
    tasksTextpTag.setAttribute("class", "task");
    tasksTextpTag.textContent = task.taskText;

    if (task.isTaskDone) {
        tasksTextpTag.classList.add("strike");
    }

    const timeStamppTag = document.createElement("p");
    // timeStamppTag.textContent = new Date(task.timeStamp).toLocaleString();
    timeStamppTag.textContent = formatTimestamp(task.timeStamp);
    timeStamppTag.textContent=formatTimestamp(task.timeStamp)


    tasksContentContainer.appendChild(tasksTextpTag);
    tasksContentContainer.appendChild(timeStamppTag);

    const tasksActionsContainer = document.createElement("div");

    const editButton = document.createElement("button");
    editButton.textContent = "edit";
    editButton.addEventListener("click", function () {
        handleTaskEdit(task.taskId);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";
    deleteButton.addEventListener("click", function () {
        handletaskdelete(task.taskId);
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

     let taskText = taskInput.value;
      taskText = taskText
        .trim()       //trim starting and ending spaces and multiple space tooo
        .split(/\s+/)  //means if there is  one or more sequnce spaces it define as one space
        .join(" ");     //jooin with space with in the string wt char you put it shows that puting char

    //  valid only if minimum 3 characters
    if (taskText.length < 3) {
        taskError.textContent = "Task must have at least 3 characters";
        return;
    }
    const newTask = {
        taskId: Date.now(),
        taskText: taskInput.value,
        isTaskDone: false,
        timeStamp: new Date().toISOString()
    };

    taskInput.value = "";

    TODOS.push(newTask);
    savedToLocal(TODOS);
    createAndPushNewTask(newTask);
    updateTaskCounts();
});

}

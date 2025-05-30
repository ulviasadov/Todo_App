const alertContainer = document.querySelector(".alert--container");
const addText = document.querySelector(".add--todo");
const addBtn = document.querySelector(".btn--add");
const ul = document.querySelector("ul");
const todoTop = document.querySelector(".todo--top");
const clearBtn = document.querySelector(".btn--delete");
const searchInput = document.querySelector(".search");
let todos = [];

runEvents();
ul.addEventListener("click", removeTodoFromUi);

function runEvents() {
    addBtn.addEventListener("click", addTodo)
    document.addEventListener("DOMContentLoaded", pageLoader);
    clearBtn.addEventListener("click", deleteAll);
    searchInput.addEventListener("keyup", filter);
};

function deleteAll() {
    const todoList = document.querySelectorAll(".list-group-item");
    todoList.forEach(todo => todo.remove())
    todos = [];
    localStorage.setItem("todos", JSON.stringify(todos));
    showAlert("success", "All todos have been deleted.");
    checkTodos();
}

function addTodo() {
    const inputText = addText.value.trim();
    if (!inputText) {
        showAlert("warning", "This section cannot be left blank.")
    } else {
        addTodoToUi(inputText);
        addTodoToStorage(inputText);
        showAlert("success", "Todo added.")
    }
}

function addTodoToUi(newTodo) {
    const li = document.createElement("li");
    li.className = "list-group-item my-todo";
    li.textContent = newTodo;

    const a = document.createElement("a");
    a.href = "#";

    const i = document.createElement("i");
    i.className = "fa-solid fa-circle-xmark";

    a.appendChild(i);
    li.appendChild(a);
    ul.appendChild(li);

    addText.value = "";

    checkTodos();
}

function addTodoToStorage(newTodo) {
    checkTodos();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos))

    checkTodos();
}

function checkTodos() {
    const stored = localStorage.getItem("todos");
    todos = stored ? JSON.parse(stored) : [];

    if (todos.length === 0) {
        clearBtn.classList.add("hidden");
    } else {
        clearBtn.classList.remove("hidden");
    }
}

function pageLoader() {
    checkTodos();
    todos.forEach(todo => addTodoToUi(todo));
}

function showAlert(type, message) {
    const div = document.createElement("div");
    div.className = `alert alert-${type}`;
    div.textContent = message;

    alertContainer.appendChild(div);

    setTimeout(() => div.remove(), 2000);
}

function removeTodoFromUi(e) {
    let myTarget = e.target.className;
    if (myTarget.includes("fa-circle-xmark")) {
        let todoItem = e.target.closest("li");
        todoItem.remove();
        removeTodoFromStorage(todoItem.textContent);
        showAlert("success", "1 element deleted.");
    }
}

function removeTodoFromStorage(removeTodo) {
    todos = todos.filter(todo => todo !== removeTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
    checkTodos();
}

function filter(e) {
    const filterValue = e.target.value.toLowerCase().trim();
    const todoList = document.querySelectorAll(".list-group-item");

    let matchFound = false;

    todoList.forEach(function (todo) {
        const isMatch = todo.textContent.toLowerCase().includes(filterValue);
        todo.style.display = isMatch ? "flex" : "none";
        if (isMatch) matchFound = true;
    });

    if (!matchFound) {
        showAlert("warning", "There is no todo for the search.");
    }
}
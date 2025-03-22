const menuButton = document.querySelector('#menuButton');
const searchBar = document.querySelector('.searchBar');
const importAllButton = document.querySelector('#importAllButton');
const exportAllButton = document.querySelector('#exportAllButton');
const signoutButton = document.querySelector('#signoutButton');
const newTodoInput = document.querySelector('#newTodoInput');
const importButton = document.querySelector('#importButton');
const todoContainer = document.querySelector('.todoContainer');
const alert = document.querySelector('#alert');

newTodoInput.addEventListener('focus', showTodoButton);
newTodoInput.addEventListener('blur', hideTodoButton);
newTodoInput.value = '';

let todoList = JSON.parse(localStorage.getItem("todoList"));
if (!todoList) {
    todoList = [
        {
            id: 1,
            title: "Work",
            items: [
                { id: 1, text: "Finish report", completed: false },
                { id: 2, text: "Email client", completed: true }
            ]
        },
        {
            id: 2,
            title: "Home",
            items: [
                { id: 1, text: "Clean kitchen", completed: false },
                { id: 2, text: "Mow lawn", completed: false }
            ]
        },
        {
            id: 3,
            title: "Shopping",
            items: [
                { id: 1, text: "Buy milk", completed: true },
                { id: 2, text: "Get bread", completed: false }
            ]
        },
        {
            id: 3,
            title: "Shopping",
            items: [
                { id: 1, text: "Buy milk", completed: true },
                { id: 2, text: "Get bread", completed: false }
            ]
        },
        {
            id: 3,
            title: "Shopping",
            items: [
                { id: 1, text: "Buy milk", completed: true },
                { id: 2, text: "Get bread", completed: false }
            ]
        },
        {
            id: 3,
            title: "Shopping",
            items: [
                { id: 1, text: "Buy milk", completed: true },
                { id: 2, text: "Get bread", completed: false }
            ]
        },
        {
            id: 3,
            title: "Shopping",
            items: [
                { id: 1, text: "Buy milk", completed: true },
                { id: 2, text: "Get bread", completed: false }
            ]
        }
    ];
};

function renderTodo() {
    todoList.forEach(element => {
        let todoCard = createTodoCard(element.title, element.items);
        todoContainer.appendChild(todoCard);
    });    
}

function createTodoCard(title, items) {
    let todoCard = document.createElement("div");
    todoCard.classList.add("todocard");
    let todoTitle = document.createElement("h3");
    todoTitle.classList.add("todoTitle");
    let todoItems = document.createElement("ul");
    todoItems.classList.add("todoItems");

    todoTitle.innerText = title;

    items.forEach(element => {
        let li = document.createElement("li");
        let listContent = document.createElement("p");
        listContent.innerText = element.text;
        li.appendChild(listContent);
        todoItems.appendChild(li);
    });

    todoCard.appendChild(todoTitle);
    todoCard.appendChild(todoItems);

    return todoCard;
};

function showTodoButton() {
    let addTodoButton = document.createElement("button");
    addTodoButton.innerText = 'Add todo';
    addTodoButton.id = 'addTodoButton';
    addTodoButton.addEventListener('click', addTodo)
    let newTodo = document.querySelector('.newTodo');
    let importButton = document.querySelector('#importButton');
    if (!newTodoInput.value) {
        newTodo.insertBefore(addTodoButton, importButton);
    }
}

function hideTodoButton() {
    let addTodoButton = document.querySelector('#addTodoButton');
    if (!newTodoInput.value) {
        addTodoButton.remove();
    }
}

function addTodo() {
    if (!newTodoInput.value) {
        todoAlert("Please input a title");
        newTodoInput.focus();
    } else {
        let newTodo = {
            id: Date.now(),
            title: newTodoInput.value,
            items: [],
            subItems: []
        };
        todoList.push(newTodo);
        setLocalStorage();
        let todoCard = createTodoCard(newTodo.title, newTodo.items);
        todoContainer.appendChild(todoCard);
        newTodoInput.value = '';
        setAlertMessage("Todo added successfully");
        hideTodoButton();
    }
}

function setAlertMessage(message) {
    let alertWrapper = document.createElement('div');
    alertWrapper.id = 'alertWrapper';
    let alertMessage = document.createElement('p');
    alertMessage.innerText = message;
    alertWrapper.appendChild(alertMessage);
    document.querySelector('main').prepend(alertWrapper);
    setTimeout(() => {
        alertWrapper.remove();
    }, 2000);
}

function setLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
}

renderTodo();


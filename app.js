// ======================
// 1. Deklarasi Variabel dan Selektor DOM
// ======================
const menuButton = document.querySelector('#menuButton');
const searchBar = document.querySelector('.searchBar');
const importAllButton = document.querySelector('#importAllButton');
const exportAllButton = document.querySelector('#exportAllButton');
const signoutButton = document.querySelector('#signoutButton');
const newTodoInput = document.querySelector('#newTodoInput');
const addTodoButton = document.querySelector('#addTodoButton');
const importButton = document.querySelector('#importButton');
const todoContainer = document.querySelector('.todoContainer');
const alert = document.querySelector('#alert');
const body = document.querySelector('body');

// ======================
// 2. Inisialisasi Data
// ======================
let todoList = JSON.parse(localStorage.getItem("todoList")) || [
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
    }
];

// ======================
// 3. Fungsi Utilitas
// ======================
function setLocalStorage() {
    localStorage.setItem("todoList", JSON.stringify(todoList));
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

function findParentByClass(element, className) {
    let target = element;
    while (target && !target.classList.contains(className)) {
        target = target.parentElement;
    }
    return target?.classList.contains(className) ? target : null;
}

// ======================
// 4. Fungsi Utama
// ======================
function renderTodo() {
    todoContainer.innerHTML = ''; // Bersihkan container sebelum render ulang
    todoList.forEach(element => {
        let todoCard = createTodoCard(element.id, element.title, element.items);
        todoContainer.prepend(todoCard);
    });
}

function createTodoCard(id, title, items) {
    let todoCard = document.createElement("div");
    todoCard.classList.add("todoCard");
    todoCard.id = id;

    let todoTitle = document.createElement("h3");
    todoTitle.classList.add("todoTitle");
    todoTitle.innerText = title;

    let todoItems = document.createElement("ul");
    todoItems.classList.add("todoItems");
    todoItems.appendChild(createTask(items));

    todoCard.appendChild(todoTitle);
    todoCard.appendChild(todoItems);

    return todoCard;
}

function createTask(items) {
    let li = document.createElement("li");

    items.forEach(element => {
        let task = document.createElement("div");
        let taskName = document.createElement("p");
        let checkbox = document.createElement("i");

        if (element.completed) {
            checkbox.classList.add("fa-regular", "fa-square");
        } else {
            checkbox.classList.add("fa-regular", "fa-square-check");
        }

        task.classList.add("task");
        taskName.innerText = element.text;
        task.appendChild(checkbox);
        task.appendChild(taskName);
        li.appendChild(task);
    });

    return li;
}

function addTodo() {
    if (!newTodoInput.value) {
        setAlertMessage("Please input a title");
        newTodoInput.focus();
    } else {
        let newTodo = {
            id: Date.now(),
            title: newTodoInput.value,
            items: [],
        };
        todoList.push(newTodo);
        setLocalStorage();
        showTodoPopup(newTodo.id);
        renderTodo(); // Render ulang daftar todo
        newTodoInput.value = '';
    }
}

function showTodoPopup(todoCardId) {
    const todo = todoList.find(element => element.id === parseInt(todoCardId));

    if (todo) {
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popupContainer');

        const popupContent = document.createElement('div');
        popupContent.classList.add('popupContent');
        popupContent.id = todoCardId;

        popupContainer.addEventListener('click', (event) => {
            if (!popupContent.contains(event.target)) {
                popupContainer.remove();
            }
        });

        popupContent.appendChild(createTitle({ todo }));
        popupContent.appendChild(createTaskList({ todo }));
        popupContent.appendChild(createPopupButtons());

        popupContainer.appendChild(popupContent);
        document.body.appendChild(popupContainer);
    }
}

function createTitle({ todo }) {
    const title = document.createElement('input');
    title.classList.add('todoPopupTitle');
    title.value = todo.title;
    title.addEventListener('blur', () => updateTodoTitle(todo.id, title.value)); 
    title.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            updateTodoTitle(todo.id, title.value);
            title.blur(); // Remove focus from the input field
        }
    });

    return title;
}

function updateTodoTitle(id, newTitle) {
    todoList.forEach((element) => {
        if (element.id == id) {
            console.log('match found!');
            element.title = newTitle;
        }
    });
    
    setLocalStorage();
    renderTodo();
};

function createTaskList({ todo }) {
    const itemList = document.createElement('ul');

    if (todo.items.length > 0) {
        todo.items.forEach(item => {
            const task = createTask([item]);
            itemList.appendChild(task);
        });
    } else {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.innerText = 'No tasks available';
        itemList.appendChild(noTasksMessage);
    }

    return itemList;
}

function createPopupButtons() {
    const buttonContainer = document.createElement('div');

    const importPopupButton = document.createElement('button');
    importPopupButton.innerText = 'Import';
    buttonContainer.appendChild(importPopupButton);

    const exportPopupButton = document.createElement('button');
    exportPopupButton.innerText = 'Export';
    buttonContainer.appendChild(exportPopupButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', (event) => deleteTodo(event));
    buttonContainer.appendChild(deleteButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', (event) => {
        const targetParent = findParentByClass(event.target, 'popupContainer');
        targetParent.remove();
    });
    buttonContainer.appendChild(closeButton);

    return buttonContainer;
}

function deleteTodo(event) {
    const targetParent = findParentByClass(event.target, 'popupContent');
    const todoId = targetParent.id;
    const todoIndex = todoList.findIndex(todo => todo.id == todoId);

    if (!confirm("Delete this list?")) {
        showTodoPopup(todoId);
    } else {
        todoList.splice(todoIndex, 1);
        setLocalStorage();
        document.querySelector('.popupContainer').remove();
        renderTodo(); // Render ulang daftar todo setelah menghapus
    }
}

// ======================
// 5. Event Listener dan Inisialisasi Aplikasi
// ======================

newTodoInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        addTodo();
        showTodoPopup(); // Remove focus from the input field
    }
});
addTodoButton.addEventListener('click', addTodo);
newTodoInput.value = '';

todoContainer.addEventListener('click', (event) => {
    const targetParent = findParentByClass(event.target, 'todoCard');
    if (targetParent) {
        showTodoPopup(targetParent.id);
    }
});

// Render todo list saat aplikasi dimuat
renderTodo();
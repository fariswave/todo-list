const menuButton = document.querySelector('#menuButton');
const searchBar = document.querySelector('.searchBar');
const importAllButton = document.querySelector('#importAllButton');
const exportAllButton = document.querySelector('#exportAllButton');
const signoutButton = document.querySelector('#signoutButton');
const newTodoInput = document.querySelector('#newTodoInput');
const importButton = document.querySelector('#importButton');
const todoContainer = document.querySelector('.todoContainer');
const alert = document.querySelector('#alert');
const body = document.querySelector('body');


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
        let todoCard = createTodoCard(element.id, element.title, element.items);
        todoContainer.appendChild(todoCard);
    });    
}

function createTodoCard(id, title, items) {
    let todoCard = document.createElement("div");
    todoCard.classList.add("todoCard");
    todoCard.id = id;
    let todoTitle = document.createElement("h3");
    todoTitle.classList.add("todoTitle");
    let todoItems = document.createElement("ul");
    todoItems.classList.add("todoItems");

    todoTitle.innerText = title;

    

    todoCard.appendChild(todoTitle);
    todoItems.appendChild(createTask(items));
    todoCard.appendChild(todoItems);

    return todoCard;
};

function createTask (items) {
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
        };
        todoList.push(newTodo);
        setLocalStorage();
        let todoCard = createTodoCard(newTodo.id, newTodo.title, newTodo.items);
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

function showTodoPopup(todoCardId) {
    // Find the matching todo in the todoList
    const todo = todoList.find(element => element.id === parseInt(todoCardId));
    
    if (todo) {
        // Create the popup container
        const popupContainer = document.createElement('div');
        popupContainer.classList.add('popupContainer');
        popupContainer.addEventListener('click', () => popupContainer.remove());
        
        // Create the popup content
        const popupContent = document.createElement('div');
        popupContent.classList.add('popupContent');
        
        // Create the title element
        const title = document.createElement('h3');
        title.innerText = todo.title;
        popupContent.appendChild(title);
        
        // Create the task list
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
        popupContent.appendChild(itemList);
        
        popupContent.appendChild(createPopupButtons());

        
        // Append the content to the container
        popupContainer.appendChild(popupContent);
        
        // Append the container to the body
        document.body.appendChild(popupContainer);
    }
}

function removePopup() {

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
    deleteButton.addEventListener('click', () => deleteTodo(this));
    buttonContainer.appendChild(deleteButton);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.addEventListener('click', (event) => {
        let target = event.target;
        while (target && !target.classList.contains('popupContainer')) {
            target = target.parentElement;
        }
        if (target && target.classList.contains('popupContainer')) {
            target.remove();
        }
    });
    buttonContainer.appendChild(closeButton);

    return buttonContainer;
}

// Add event listener to todoContainer to handle clicks on todoCards
todoContainer.addEventListener('click', (event) => {
    let target = event.target;
    while (target && !target.classList.contains('todoCard')) {
        target = target.parentElement;
    }
    if (target && target.classList.contains('todoCard')) {
        const todoCardId = target.id;
        showTodoPopup(todoCardId);
    }
});

function deleteTodo(i) {
    console.log(i);
}








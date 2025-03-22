const menuButton = document.querySelector('#menuButton');
const searchBar = document.querySelector('.searchBar');
const importAllButton = document.querySelector('#importAllButton');
const exportAllButton = document.querySelector('#exportAllButton');
const signoutButton = document.querySelector('#signoutButton');
const newTodoInput = document.querySelector('#newTodoInput');
const importButton = document.querySelector('.importButton');
const todoContainer = document.querySelector('.todoContainer');

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

renderTodo();


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

/**
 * Find the first parent element that has the given class name.
 * @param {Element} element The element to start searching from.
 * @param {string} className The class name to search for.
 * @returns {Element|null} The first parent element that has the given class name, or null if not found.
 */
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

/**
 * Render todo list ke dalam elemen dengan kelas todoContainer.
 *
 * @description Menghapus konten elemen todoContainer sebelumnya dan menambahkan elemen-elemen todo baru.
 *
 * @returns {undefined}
 */
function renderTodo() {
    todoContainer.innerHTML = ''; // Bersihkan container sebelum render ulang
    todoList.forEach(element => {
        let todoCard = createTodoCard(element.id, element.title, element.items);
        todoContainer.prepend(todoCard);
    });
}

/**
 * Membuat elemen todoCard yang berisi judul dan daftar item todo.
 *
 * @param {number} id - ID dari todo yang akan dibuatkan elemen todoCard.
 * @param {string} title - Judul dari todo yang akan dibuatkan elemen todoCard.
 * @param {Array<Object>} items - Daftar item todo yang akan dibuatkan elemen todoCard.
 *
 * @returns {Element} Elemen todoCard yang telah dibuat.
 */
function createTodoCard(id, title, items) {
    // console.log("items grabbed by createTodoCard", items);
    let todoCard = document.createElement("div");
    todoCard.classList.add("todoCard");
    todoCard.id = id;

    let todoTitle = document.createElement("h3");
    todoTitle.classList.add("todoTitle");
    todoTitle.innerText = title;

    let todoItems = document.createElement("ul");
    todoItems.classList.add("todoItems");
    todoItems.appendChild(createTaskList(id, items));

    todoCard.appendChild(todoTitle);
    todoCard.appendChild(todoItems);

    return todoCard;
}

/**
 * Membuat elemen li yang berisi task name dan checkbox.
 *
 * @param {Object} items - Daftar item todo yang akan dibuatkan elemen li.
 *
 * @description Membuat elemen li yang berisi task name dan checkbox. Jika task completed, maka
 *              task name akan digarisbawahi dan checkbox akan berisi icon "fa-square-check".
 *              Jika task belum completed, maka task name tidak digarisbawahi dan checkbox akan
 *              berisi icon "fa-square".
 *
 * @returns {Element} Elemen li yang telah dibuat.
 */
function createTask(taskData) {
    let li = document.createElement("li");
    let task = document.createElement("div");
    let taskName = document.createElement("p");
    let checkbox = document.createElement("i");
    checkbox.id = taskData.id;
    checkbox.addEventListener('click', (event) => toggleTaskCompletion(event.target));

    if (taskData.completed) {
        checkbox.classList.add("fa-regular", "fa-square-check");
        taskName.style.textDecoration = "line-through";
    } else {
        checkbox.classList.add("fa-regular", "fa-square");
    }

    task.classList.add("task");
    taskName.innerText = taskData.text;
    task.appendChild(checkbox);
    task.appendChild(taskName);
    li.appendChild(task);
    return li;
}


/**
 * Membalikkan status task yang dipilih.
 *
 * @param {Element} checkboxElement - Elemen checkbox yang diklik.
 *
 * @description Membalikkan status task yang dipilih dengan mengubah properti `completed`
 *              pada objek task yang sesuai. Kemudian, menghapus popup yang sedang
 *              ditampilkan dan menampilkan daftar todo yang diperbarui.
 */

function toggleTaskCompletion(checkboxElement) {
    const todoElement = findParentByClass(checkboxElement, 'popupContent');
    const popUpContainerElement = findParentByClass(checkboxElement, 'popupContainer');
    let todoToChange = todoList.find(todo => todo.id == todoElement.id);
    let taskToToggle = todoToChange.items.find(task => task.id == checkboxElement.id);

    if (taskToToggle) {
        taskToToggle.completed = !taskToToggle.completed;
        setLocalStorage();
        popUpContainerElement.remove();
        showTodoPopup(todoElement.id);
        renderTodo();
    }
};

/**
 * Menambahkan todo baru ke dalam daftar todo dan menyimpannya ke local storage.
 *
 * @description Jika inputan judul todo tidak kosong, maka membuat objek todo baru dan menambahkannya ke dalam daftar todo.
 *              Kemudian, menyimpan daftar todo ke dalam local storage dan menampilkan popup untuk mengedit todo yang baru dibuat.
 *              Jika inputan judul todo kosong, maka menampilkan pesan error dan memberikan fokus pada inputan judul todo.
 *
 * @returns {undefined}
 */
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

/**
 * Menampilkan popup untuk mengedit sebuah todo.
 *
 * @param {number} todoCardId - ID dari todoCard yang akan ditampilkan pop-up-nya.
 *
 * @returns {void} Tidak mengembalikan apa-apa.
 */
function showTodoPopup(todoCardId) {
    const todo = todoList.find(({ id }) => id === parseInt(todoCardId));

    if (todo) {
        const popupContainer = document.createElement('div');
        popupContainer.className = 'popupContainer';

        const popupContent = document.createElement('div');
        popupContent.className = 'popupContent';
        popupContent.id = todoCardId;

        /**
         * Menghapus popup yang sedang ditampilkan jika user mengklik
         * di luar area popup.
         *
         * @param {Event} event - Event klik yang terjadi.
         *
         * @description Menghapus popup yang sedang ditampilkan jika user
         *              mengklik di luar area popup. Jika user mengklik di
         *              dalam area popup, maka tidak terjadi apa-apa.
         */
        popupContainer.onclick = ({ target }) => {
            if (!popupContent.contains(target)) {
                popupContainer.remove();
            }
        };

        popupContent.append(
            createTitle(todo),
            createTaskList(todoCardId, todo.items),
            createNewTaskInput(todoCardId),
            createPopupButtons(todoCardId)
        );

        popupContainer.appendChild(popupContent);

        if (!document.querySelector('.popupContainer')) {
            document.body.appendChild(popupContainer);
        }
    }
}

/**
 * Membuat elemen input untuk menambahkan task baru ke dalam todo yang dipilih.
 *
 * @param {number} id - ID dari todo yang akan ditambahkan task baru.
 *
 * @returns {Element} Elemen input yang telah dibuat.
 */
function createNewTaskInput(id) {
    let newTaskInput = document.createElement('input');
    newTaskInput.placeholder = "Add a new task";
    newTaskInput.onkeyup = (event) => {
        if (event.key === 'Enter') {
            addNewTask(id, newTaskInput.value);
            newTaskInput.focus();
        }
    };

    return newTaskInput;
}

/**
 * Adds a new task to the specified todo item and updates the display.
 *
 * @param {number} id - The ID of the todo item to which the new task will be added.
 * @param {string} newTask - The text of the new task to be added.
 *
 * @description Finds the todo item with the given ID, adds a new task to its items list, 
 * stores the updated list in local storage, removes the existing popup, and re-renders the popup and todo list.
 *
 * @returns {void} Does not return anything.
 */

function addNewTask(id, newTask) {
    todoList.forEach((element) => {
        let newId = id;
        if (element.id == id) {
            element.items.push({
                id: Date.now(),
                text: newTask,
                completed: false
            });
            setLocalStorage();
            const popupContainer = document.querySelector('.popupContainer');
            popupContainer.remove();
            showTodoPopup(id);
            renderTodo();
        }
    })
}

/**
 * Creates an input element for the title of a todo item in the todo popup.
 *
 * @param {Object} todo - The todo item whose title will be displayed in the input element.
 *
 * @description Creates an input element with the todo item's title as its value and adds event listeners to update the todo item's title and remove focus from the input field when the user presses Enter or blurs the input field.
 *
 * @returns {Element} The input element with the todo item's title.
 */
function createTitle(todo) {
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

/**
 * Updates the title of a todo item in the todo list and re-renders the todo list.
 *
 * @param {number} id - The ID of the todo item to be updated.
 * @param {string} newTitle - The new title of the todo item.
 * 
 * @description Iterates through the todo list and updates the title of the todo item whose ID matches the given ID, saves the updated list to local storage, and re-renders the todo list.
 */

function updateTodoTitle(id, newTitle) {
    todoList.forEach((element) => {
        if (element.id == id) {
            element.title = newTitle;
        }
    });
    
    setLocalStorage();
    renderTodo();
};

/**
 * Creates an unordered list element for the task list of a todo item in the todo popup.
 *
 * @param {Object} todo - The todo item whose task list will be displayed in the unordered list element.
 *
 * @description Creates an unordered list element with list items for each task in the todo item's task list and appends a new task input element at the end of the list.
 *
 * @returns {Element} The unordered list element with the task list of the todo item.
 */
function createTaskList(id, itemsArray) {
    const itemList = document.createElement('ul');
    const newTaskInput = createNewTaskInput(id);

    if (itemsArray.length > 0) {
        itemsArray.forEach(item => {
            const task = createTask(item);
            itemList.appendChild(task);
        });    
    } else {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.innerText = 'No tasks available';
        itemList.appendChild(noTasksMessage);
    }
    
    return itemList;
}

/**
 * Creates a container element that holds multiple action buttons for the todo popup.
 *
 * @param {number} todoId - The ID of the todo item associated with the popup.
 *
 * @returns {Element} A div element containing various action buttons.
 */
function createPopupButtons(todoId) {
    // Create a div element to serve as the container for the buttons
    const buttonContainer = document.createElement('div');

    // Define an array of button data, including button text and click event handlers
    const buttonsData = [
        { text: 'Import' }, // Button for importing (functionality not implemented)
        { text: 'Export' }, // Button for exporting (functionality not implemented)
        { 
            text: 'Delete', 
            // The 'Delete' button has an event listener that calls deleteTodo with the provided todoId
            onClick: () => deleteTodo(todoId) 
        },
        { 
            text: 'Close', 
            // The 'Close' button has an event listener that removes the popup container from the DOM
            onClick: () => document.querySelector('.popupContainer').remove() 
        }
    ];

    // Iterate over each button data object
    for (const { text, onClick } of buttonsData) {
        // Create a button element and append it to the buttonContainer
        const button = buttonContainer.appendChild(document.createElement('button'));
        // Set the button's text content to the specified text
        button.textContent = text;
        // If an onClick function is provided, add it as a click event listener with passive option
        onClick && button.addEventListener('click', onClick, { passive: true });
    }

    // Return the container element with all the buttons
    return buttonContainer;
}

/**
 * Menghapus todo yang dipilih dan menyimpan perubahan ke local storage.
 *
 * @param {number} todoId - ID dari todo yang akan dihapus.
 *
 * @description Jika user mengkonfirmasi penghapusan, maka menghapus todo yang dipilih dari daftar todo dan menyimpan perubahan ke local storage.
 *              Kemudian, menghapus popup yang sedang ditampilkan dan menampilkan daftar todo yang diperbarui.
 *              Jika user tidak mengkonfirmasi penghapusan, maka menampilkan popup yang sedang ditampilkan kembali.
 */
function deleteTodo(todoId) {
    const deletePopup = document.createElement('div');
    deletePopup.className = 'deletePopup';
    deletePopup.innerHTML = `
        <p>Are you sure you want to delete this list?</p>
        <button class="deleteYes">Yes</button>
        <button class="deleteNo">No</button>
    `;

    document.querySelector('.popupContent').appendChild(deletePopup);

    const yesButton = deletePopup.querySelector('.deleteYes');
    const noButton = deletePopup.querySelector('.deleteNo');

    yesButton.addEventListener('click', () => {
        const todoIndex = todoList.findIndex(todo => todo.id === todoId);
        todoList.splice(todoIndex, 1);
        setLocalStorage();
        // deletePopup.remove();
        document.querySelector('.popupContainer').remove();
        renderTodo(); // Render ulang daftar todo setelah menghapus
    });

    noButton.addEventListener('click', () => {
        document.querySelector('.popupContainer').remove();
        showTodoPopup(todoId);
});
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
    // console.log(targetParent);
    if (targetParent) {
        showTodoPopup(targetParent.id);
        // console.log("id grabbed by pop up container listener", targetParent.id);
    }
});

// Render todo list saat aplikasi dimuat
renderTodo();
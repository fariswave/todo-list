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
// 4. Fungsi Utama - Manajemen Todo
// ======================
/**
 * Toggle the visibility of the sidebar containing the list of todo titles.
 *
 * @description If the sidebar does not exist, create and show it with the list of todo titles.
 *              If the sidebar exists, remove it and reset the todo container margin.
 *              When a todo title is clicked, show the corresponding todo popup without hiding the sidebar.
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) {
        // Create sidebar element and populate it with todo titles
        const sidebarElement = document.createElement('div');
        sidebarElement.className = 'sidebar';

        todoList.forEach(todo => {
            const todoTitleElement = document.createElement('div');
            todoTitleElement.className = 'sidebarTodoTitle';
            todoTitleElement.innerText = todo.title;
            todoTitleElement.addEventListener('click', () => showTodoPopup(todo.id));
            sidebarElement.prepend(todoTitleElement);
        });

        // Append sidebar to main and update layout
        document.querySelector('main').prepend(sidebarElement);
        document.querySelector('main').style.display = 'grid';
        document.querySelector('main').style.gridTemplateColumns = '250px auto';
        document.querySelector('main').style.gridTemplateRows = 'auto auto';
        document.querySelector('.newTodo').style.gridColumn = '2';
        document.querySelector('.newTodo').style.gridRow = '1';
        document.querySelector('.todoContainer').style.gridColumn = '2';
        document.querySelector('.todoContainer').style.gridRow = '2';
        sidebarElement.style.gridRow = '1 / 3';
        sidebarElement.style.gridColumn = '1';
    } else {
        // Remove sidebar and reset layout
        sidebar.remove();
        document.querySelector('main').style.display = '';
    }
}

// Attach event listener to menuButton
menuButton.addEventListener('click', toggleSidebar);


/**
 * Render todo list ke dalam elemen dengan kelas todoContainer.
 *
 * @description Menghapus konten elemen todoContainer sebelumnya dan menambahkan elemen-elemen todo baru.
 *
 * @returns {undefined}
 */
function renderTodo() {
    document.querySelector('header').style.display = '';
    document.querySelector('main').style.display = '';
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
    let todoCard = document.createElement("div");
    todoCard.classList.add("todoCard");
    todoCard.id = id;

    let todoTitle = document.createElement("h3");
    todoTitle.classList.add("todoTitle");
    todoTitle.innerText = title;

    // let todoItems = document.createElement("ul");
    // todoItems.classList.add("todoItems");
    // todoItems.appendChild(createTaskList(items));

    todoCard.appendChild(todoTitle);
    todoCard.appendChild(createTaskList(items));

    return todoCard;
}

/**
 * Searches for todos based on the keyword input in the search bar and displays the results in the todoContainer element.
 */
function searchTodo() {
    // Get the keyword from the search bar, convert it to lowercase for case-insensitive search
    let keyword = searchBar.value.toLowerCase();

    // Filter the todo list to find todos that match the keyword in their title or any of their items
    let result = todoList.filter(todo => {
        // Check if the todo title includes the keyword or any item's text includes the keyword
        return todo.title.toLowerCase().includes(keyword) || 
               todo.items.some(item => item.text.toLowerCase().includes(keyword));
    });

    // Clear the todoContainer before rendering the filtered results
    todoContainer.innerHTML = '';

    // Iterate over each filtered todo and render it
    result.forEach(element => {
        // Create a todo card element using the todo's id, title, and items
        let todoCard = createTodoCard(element.id, element.title, element.items);
        // Prepend the newly created todo card to the todoContainer
        todoContainer.prepend(todoCard);
    });
}

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
        if (document.querySelector('.sidebar')) {
            toggleSidebar()
        };
        showTodoPopup(newTodo.id);
        renderTodo(); // Render ulang daftar todo
        newTodoInput.value = '';
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
            newTaskInput.focus();
            addNewTask(id, newTaskInput.value);
        }
    };

    return newTaskInput;
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
 * Creates an unordered list of task items from an array of task objects.
 *
 * @param {Array<Object>} itemsArray - Array of task objects with properties `id`, `text`, and `completed`.
 *
 * @description Separates the tasks into two arrays, one for completed tasks and one for uncompleted tasks.
 *              Reverses the uncompleted tasks array so that the most recently added task is at the top of the list.
 *              Appends the completed tasks to the unordered list.
 *              If the task list is empty, appends a message to the unordered list indicating that there are no tasks available.
 *
 * @returns {Element} The unordered list of task items.
 */
function createTaskList(itemsArray) {
    const itemList = document.createElement('ul');  
    itemList.classList.add('todoItems');

    const uncompletedTasks = [];
    const completedTasks = [];

    // Separate the tasks into two arrays, one for completed tasks and one for uncompleted tasks
    itemsArray.forEach(item => {
        const task = createTask(item);
        if (item.completed) {
            completedTasks.push(task);
        } else {
            uncompletedTasks.push(task);
        }
    });

    // Reverse the uncompleted tasks array so that the most recently added task is at the top of the list
    uncompletedTasks.reverse().forEach(task => itemList.appendChild(task));

    // Append the completed tasks to the unordered list
    completedTasks.forEach(task => itemList.appendChild(task));

    // If the task list is empty, append a message to the unordered list indicating that there are no tasks available
    if (itemsArray.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.innerText = 'No tasks available';
        itemList.appendChild(noTasksMessage);
    }
    
    return itemList;
}

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
        document.querySelector('.popupContainer').remove();
        renderTodo(); // Render ulang daftar todo setelah menghapus
    });

    noButton.addEventListener('click', () => {
        document.querySelector('.popupContainer').remove();
        showTodoPopup(todoId);
});
}

// ======================
// 5. FUNGSI POPUP
// ======================


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

        if (window.innerWidth <= 600) {
            document.querySelector('header').style.display = 'none';
            document.querySelector('main').style.display = 'none';
        }
        popupContainer.onclick = ({ target }) => {
            if (!popupContent.contains(target)) {
                popupContainer.remove();
            }
        };

        popupContent.append(
            createTitle(todo),
            createTaskList(todo.items),
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
 * Creates a container element that holds multiple action buttons for the todo popup.
 *
 * @param {number} todoId - The ID of the todo item associated with the popup.
 *
 * @returns {Element} A div element containing various action buttons.
 */
function createPopupButtons(todoId) {
    // Create a div element to serve as the container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttonContainer';

    // Define an array of button data, including button text and click event handlers
    const buttonsData = [
        { 
            text: 'Delete', 
            // The 'Delete' button has an event listener that calls deleteTodo with the provided todoId
            onClick: () => deleteTodo(todoId) 
        },
        { 
            text: 'Close', 
            // The 'Close' button has an event listener that removes the popup container from the DOM
            onClick: () => {
                document.querySelector('.popupContainer').remove();
                renderTodo();
            }
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

function addNewTask(id, newTask) {
    todoList.forEach((element) => {
        // let newId = id;
        if (element.id == id) {
            element.items.push({
                id: Date.now(),
                text: newTask,
                completed: false
            });
            setLocalStorage();
            document.querySelector('.popupContainer').remove();
            showTodoPopup(id);
            renderTodo();
        }
    })
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
 * Menghapus todo yang dipilih dan menyimpan perubahan ke local storage.
 *
 * @param {number} todoId - ID dari todo yang akan dihapus.
 *
 * @description Jika user mengkonfirmasi penghapusan, maka menghapus todo yang dipilih dari daftar todo dan menyimpan perubahan ke local storage.
 *              Kemudian, menghapus popup yang sedang ditampilkan dan menampilkan daftar todo yang diperbarui.
 *              Jika user tidak mengkonfirmasi penghapusan, maka menampilkan popup yang sedang ditampilkan kembali.
 */


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

searchBar.addEventListener('input', searchTodo);

todoContainer.addEventListener('click', (event) => {
    const targetParent = findParentByClass(event.target, 'todoCard');
    if (targetParent) {
        showTodoPopup(targetParent.id);
    }
});

// Render todo list saat aplikasi dimuat
renderTodo();


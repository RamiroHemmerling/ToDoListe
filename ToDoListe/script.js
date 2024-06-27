document.addEventListener('DOMContentLoaded', function() {
    let todos = [];
    let editIndex = -1;

    // Get DOM elements
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('search-button');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');
    const todoModal = document.getElementById('todo-modal');
    const todoDetailsModal = document.getElementById('todo-details-modal');
    const closeModalButtons = document.querySelectorAll('.close-button');
    const todoNameInput = document.getElementById('todo-name');
    const todoDescriptionInput = document.getElementById('todo-description');
    const todoAuthorInput = document.getElementById('todo-author');
    const todoCategoryInput = document.getElementById('todo-category');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const saveTodoButton = document.getElementById('save-todo-button');
    const errorMessage = document.getElementById('error-message'); 
    const barometerFill = document.getElementById('barometer-fill');

    // Display todos with priority titles
    function renderTodos(filteredTodos = todos) {
        todoList.innerHTML = '';

        const priorities = [
            { title: 'Sofort erledigen', filter: todo => todo.important && todo.urgent },
            { title: 'Einplanen und Wohlfühlen', filter: todo => todo.important && !todo.urgent },
            { title: 'Gib es ab', filter: todo => !todo.important && todo.urgent },
            { title: 'Weg damit', filter: todo => !todo.important && !todo.urgent }
        ];

        priorities.forEach(priority => {
            const priorityTodos = filteredTodos.filter(priority.filter);

            if (priorityTodos.length > 0) {
                const priorityTitle = document.createElement('h3');
                priorityTitle.className = 'priority-title';
                priorityTitle.textContent = priority.title;
                todoList.appendChild(priorityTitle);

                priorityTodos.forEach((todo, index) => {
                    const todoIndex = todos.indexOf(todo);
                    const todoItem = document.createElement('li');
                    todoItem.innerHTML = `
                        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodoCompletion(${todoIndex})">
                        <span onclick="showTodoDetails(${todoIndex})">${todo.name}</span>
                        <button class="edit-button" onclick="editTodo(${todoIndex})">
                          <img src="icons/EditIcon.svg" alt="Edit" />
                        </button>
                        <button class="delete-button" onclick="deleteTodo(${todoIndex})">
                          <img src="icons/DeleteIcon.svg" alt="Delete" />
                        </button>
                    `;
                    todoList.appendChild(todoItem);
                });
            }
        });

        updateBarometer();
    }

    // Toggle completion status
    window.toggleTodoCompletion = function(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    };

    // Update barometer
    function updateBarometer() {
        const completedTodos = todos.filter(todo => todo.completed).length;
        const totalTodos = todos.length;
        const percentageCompleted = totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100;
        barometerFill.style.width = `${percentageCompleted}%`;
        barometerFill.innerText = percentageCompleted > 0 ? `${Math.round(percentageCompleted)}% erledigt` : '';
    }

    // Show To-Do details
    window.showTodoDetails = function(index) {
        const todo = todos[index];
        document.getElementById('details-title').innerText = todo.name; 
        document.getElementById('details-title-name').innerText = todo.name;
        document.getElementById('details-description').innerText = todo.description;
        document.getElementById('details-author').innerText = 'Autor: ' + todo.author;
        document.getElementById('details-category').innerText = 'Kategorie: ' + todo.category;
        document.getElementById('details-important').innerText = 'Wichtig: ' + (todo.important ? 'Ja' : 'Nein');
        document.getElementById('details-urgent').innerText = 'Dringend: ' + (todo.urgent ? 'Ja' : 'Nein');
        document.getElementById('details-start-date').innerText = todo.startDate;
        document.getElementById('details-end-date').innerText = todo.endDate;
        todoDetailsModal.style.display = 'block';
    };

    // Edit To-Do
    window.editTodo = function(index) {
        const todo = todos[index];
        todoNameInput.value = todo.name;
        todoDescriptionInput.value = todo.description;
        todoAuthorInput.value = todo.author;
        todoCategoryInput.value = todo.category;
        startDateInput.value = todo.startDate;
        endDateInput.value = todo.endDate;

        errorMessage.style.display = 'none';
        editIndex = index;
        todoModal.style.display = 'block';
    };

    // Delete To-Do
    window.deleteTodo = function(index) {
        todos.splice(index, 1);
        renderTodos();
    };

    // Add or edit To-Do
    function addOrEditTodo() {
        const todo = {
            name: todoNameInput.value,
            description: todoDescriptionInput.value,
            author: todoAuthorInput.value,
            category: todoCategoryInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            important: document.getElementById('todo-important').checked,
            urgent: document.getElementById('todo-urgent').checked,
            completed: false
        };

        // Validation of the input fields
        if (!todo.name || !todo.description || !todo.author || !todo.category || !todo.startDate || !todo.endDate) {
            errorMessage.textContent = "Bitte füllen Sie alle erforderlichen Felder aus.";
            errorMessage.style.display = 'block';
            return;
        }

        // Validation for max length
        if (todo.name.length > 255 || todo.description.length > 255 || todo.author.length > 20) {
            errorMessage.textContent = "Einige Felder überschreiten die maximale Länge.";
            errorMessage.style.display = 'block';
            return;
        }

        // Validation for start date before end date
        if (new Date(todo.startDate) >= new Date(todo.endDate)) {
            errorMessage.textContent = "Das Startdatum muss vor dem Enddatum liegen.";
            errorMessage.style.display = 'block';
            return;
        }

        if (editIndex === -1) {
            todos.push(todo);
        } else {
            todos[editIndex] = todo;
            editIndex = -1;
        }

        // Clear inputs after saving
        todoNameInput.value = '';
        todoDescriptionInput.value = '';
        todoAuthorInput.value = '';
        todoCategoryInput.value = '';
        startDateInput.value = '';
        endDateInput.value = '';

        errorMessage.style.display = 'none';
        todoModal.style.display = 'none';
        renderTodos();
    }

    // Search To-Dos
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTodos = todos.filter(todo => todo.name.toLowerCase().includes(searchTerm));
        renderTodos(filteredTodos);
    });

    // Open modal to add To-Do
    addTodoButton.addEventListener('click', function() {
        errorMessage.style.display = 'none';
        todoModal.style.display = 'block';
    });

    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            todoModal.style.display = 'none';
            todoDetailsModal.style.display = 'none';
        });
    });

    // Save To-Do
    saveTodoButton.addEventListener('click', addOrEditTodo);

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target === todoModal) {
            todoModal.style.display = 'none';
        }
        if (event.target === todoDetailsModal) {
            todoDetailsModal.style.display = 'none';
        }
    }
});

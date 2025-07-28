const todo = {
    action(e) { // e это event
        const target = e.target;
        if (target.classList.contains('todo__action')) {
            const action = target.dataset.todoAction;
            const elemItem = target.closest('.todo__item');
            if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
                elemItem.remove();
            } else {
                elemItem.dataset.todoState = action;
            }
            this.saveTask();
        } else if (target.classList.contains('todo__add')) {
            this.addNewTask();
            this.saveTask();
        }
    },
    addNewTask() {
        const todoTextElem = document.querySelector('.todo__text');

        if (todoTextElem.disabled || !todoTextElem.value.length) {
            return;
        }

        const todoItemsElem = document.querySelector('.todo__items')
        const todoItemString = this.createTodoItemString(todoTextElem.value);

        todoItemsElem.insertAdjacentHTML('beforeend', todoItemString);
        todoTextElem.value = '';
    },
    createTodoItemString(titleTask) {
        return `<li class="todo__item" data-todo-state="active">
                    <span class="todo__task">${titleTask}</span>
                    <span class="todo__action todo__action_restore" data-todo-action="active"></span>
                    <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
                    <span class="todo__action todo__action_delete" data-todo-action="deleted"></span>
                </li>`;
    },
    init() {
        const fromStorage = localStorage.getItem('todo');
        if (fromStorage) {
            document.querySelector('.todo__items').innerHTML = fromStorage;
        }
        document.querySelector('.todo__options').addEventListener('change', this.filterTasks);
        document.addEventListener('click', this.action.bind(this))
    },
    filterTasks() {
        const option = document.querySelector('.todo__options').value;
        document.querySelector('.todo__items').dataset.todoOption = option;
        document.querySelector('.todo__text').disabled = option !== 'active';
    },
    saveTask() {
        localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
    }
};

todo.init();
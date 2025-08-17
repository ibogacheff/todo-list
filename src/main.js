const deletedState = "deleted";
const TODO_TEXT = ".todo__text";
const TODO_OPTIONS = ".todo__options";
const TODO_UPDATEDAT = "todo__updatedAt";
const TODO_ACTION = "todo__action";
const TODO_ITEM = "todo__item";
const TODO_DESCRIPTION = "todo__description";
const TODO_ITEMS = ".todo__items";

const optionsDate = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};
const optionsTime = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const todo = {
  action(e) {
    const target = e.target;
    if (target.classList.contains(TODO_ACTION)) {
      const action = target.dataset.todoAction;
      const isDescribe = target.dataset.todoDescribe;
      const elemItem = target.closest(`.${TODO_ITEM}`);

      if (isDescribe) {
        const todoItemContainer = target.closest(`.${TODO_ITEM}`);
        const descriptionElement = todoItemContainer.querySelector(
          `.${TODO_DESCRIPTION}`
        );
        this.addDescription(descriptionElement);
        return;
      }

      if (
        action === deletedState &&
        elemItem.dataset.todoState === deletedState
      ) {
        elemItem.remove();
      } else {
        elemItem.dataset.todoState = action;
        if (elemItem.querySelector(`.${TODO_UPDATEDAT}`)) {
          elemItem.querySelector(`.${TODO_UPDATEDAT}`).remove();
        }
        this.addUpdatedAt(elemItem);
      }
      this.saveTask();
    } else if (target.classList.contains("todo__add")) {
      this.addNewTask();
      this.saveTask();
    }
  },
  addUpdatedAt(elemItem) {
    const date = new Date();
    const itemUpdationDate = date.toLocaleDateString("ru-RU", optionsDate);
    const itemUpdationTime = date.toLocaleTimeString("ru-RU", optionsTime);
    const updatedAtElement = elemItem.querySelector(`.${TODO_UPDATEDAT}`);

    if (updatedAtElement) {
      updatedAtElement.textContent = `Изменена: ${itemUpdationDate} в ${itemUpdationTime}`;
    } else {
      elemItem.insertAdjacentHTML(
        "beforeend",
        `<div class=${TODO_UPDATEDAT}>Изменена: ${itemUpdationDate} в ${itemUpdationTime}</div>`
      );
    }
  },
  addNewTask() {
    const todoTextElem = document.querySelector(TODO_TEXT);

    if (todoTextElem.disabled || !todoTextElem.value.length) {
      return;
    }

    const todoItemsElem = document.querySelector(TODO_ITEMS);
    const todoItemString = this.createTodoItemString(todoTextElem.value);

    todoItemsElem.insertAdjacentHTML("beforeend", todoItemString);
    todoTextElem.value = "";
  },
  createTodoItemString(titleTask) {
    const { itemCreationDate, itemCreationTime } = this.addCreatedAt();

    return `<li class=${TODO_ITEM} data-todo-state="active">
                    <span class="todo__task">${titleTask}</span>
                    <div class=${TODO_DESCRIPTION}>Описание</div>
                    <div class="todo__createdAt">Создана: ${itemCreationDate} в ${itemCreationTime}</div>
                    <span class="${TODO_ACTION} todo__action_restore" data-todo-action="active"></span>
                    <span class="${TODO_ACTION} todo__action_complete" data-todo-action="completed"></span>
                    <span class="${TODO_ACTION} todo__action_delete" data-todo-action="deleted"></span>
                    <span class="${TODO_ACTION} todo__action_describe" data-todo-action="active" data-todo-describe="true"></span>
                </li>`;
  },
  addCreatedAt() {
    const date = new Date();

    const itemCreationDate = date.toLocaleDateString("ru-RU", optionsDate);
    const itemCreationTime = date.toLocaleTimeString("ru-RU", optionsTime);
    return { itemCreationDate, itemCreationTime };
  },
  init() {
    const fromStorage = localStorage.getItem("todo");

    if (fromStorage) {
      document.querySelector(TODO_ITEMS).innerHTML = fromStorage;
    }
    document
      .querySelector(TODO_OPTIONS)
      .addEventListener("change", this.filterTasks);
    document.addEventListener("click", this.action.bind(this));
  },
  filterTasks() {
    const option = document.querySelector(TODO_OPTIONS).value;
    document.querySelector(TODO_ITEMS).dataset.todoOption = option;
    document.querySelector(TODO_TEXT).disabled = option !== "active";
  },
  saveTask() {
    localStorage.setItem("todo", document.querySelector(TODO_ITEMS).innerHTML);
  },
  addDescription(descriptionElement) {
    let descriptionText = prompt("Пожалуйста, добавьте описание:");

    if (descriptionText == null || descriptionText.trim() === "") {
      return;
    }

    if (descriptionElement) {
      descriptionElement.textContent = descriptionText;
      this.addUpdatedAt(descriptionElement.closest(`.${TODO_ITEM}`));
    }
  },
};

todo.init();

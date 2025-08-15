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

const deletedState = "deleted";

const todo = {
  action(e) {
    const target = e.target;
    if (target.classList.contains("todo__action")) {
      const action = target.dataset.todoAction;
      const isDescribe = target.dataset.todoDescribe;
      const elemItem = target.closest(".todo__item");

      if (isDescribe) {
        const todoItemContainer = target.closest(".todo__item");
        const descriptionElement =
          todoItemContainer.querySelector(".todo__description");
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
        if (elemItem.querySelector(".todo__updatedAt")) {
          elemItem.querySelector(".todo__updatedAt").remove();
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
    const updatedAtElement = elemItem.querySelector(".todo__updatedAt");

    if (updatedAtElement) {
      updatedAtElement.textContent = `Изменена: ${itemUpdationDate} в ${itemUpdationTime}`;
    } else {
      elemItem.insertAdjacentHTML(
        "beforeend",
        `<div class="todo__updatedAt">Изменена: ${itemUpdationDate} в ${itemUpdationTime}</div>`
      );
    }
  },
  addNewTask() {
    const todoTextElem = document.querySelector(".todo__text");

    if (todoTextElem.disabled || !todoTextElem.value.length) {
      return;
    }

    const todoItemsElem = document.querySelector(".todo__items");
    const todoItemString = this.createTodoItemString(todoTextElem.value);

    todoItemsElem.insertAdjacentHTML("beforeend", todoItemString);
    todoTextElem.value = "";
  },
  createTodoItemString(titleTask) {
    const { itemCreationDate, itemCreationTime } = this.addCreatedAt();

    return `<li class="todo__item" data-todo-state="active">
                    <span class="todo__task">${titleTask}</span>
                    <div class="todo__description">Описание</div>
                    <div class="todo__createdAt">Создана: ${itemCreationDate} в ${itemCreationTime}</div>
                    <span class="todo__action todo__action_restore" data-todo-action="active"></span>
                    <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
                    <span class="todo__action todo__action_delete" data-todo-action="deleted"></span>
                    <span class="todo__action todo__action_describe" data-todo-action="active" data-todo-describe="true"></span>
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
      document.querySelector(".todo__items").innerHTML = fromStorage;
    }
    document
      .querySelector(".todo__options")
      .addEventListener("change", this.filterTasks);
    document.addEventListener("click", this.action.bind(this));
  },
  filterTasks() {
    const option = document.querySelector(".todo__options").value;
    document.querySelector(".todo__items").dataset.todoOption = option;
    document.querySelector(".todo__text").disabled = option !== "active";
  },
  saveTask() {
    localStorage.setItem(
      "todo",
      document.querySelector(".todo__items").innerHTML
    );
  },
  addDescription(descriptionElement) {
    let descriptionText = prompt("Пожалуйста, добавьте описание:");

    if (descriptionText == null || descriptionText.trim() === "") {
      return;
    }

    if (descriptionElement) {
      descriptionElement.textContent = descriptionText;
      this.addUpdatedAt(descriptionElement.closest(".todo__item"));
    }
  },
};

todo.init();

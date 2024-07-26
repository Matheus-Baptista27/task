// Seleção de elementos
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;

// Funções
const saveTask = (text, done = 0, save = 1) => {
  const task = document.createElement("div");
  task.classList.add("task");

  const taskTitle = document.createElement("h3");
  taskTitle.innerText = text;
  task.appendChild(taskTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-task");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  task.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-task");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  task.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-task");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  task.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTaskLocalStorage({ text, done: 0 });
  }

  taskList.appendChild(task);

  taskInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  taskForm.classList.toggle("hide");
  taskList.classList.toggle("hide");
};

const updateTask = (text) => {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    let taskTitle = task.querySelector("h3");

    if (taskTitle.innerText === oldInputValue) {
      taskTitle.innerText = text;

      // Utilizando dados da localStorage
      updateTaskLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTasks = (search) => {
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    const taskTitle = task.querySelector("h3").innerText.toLowerCase();

    task.style.display = "flex";

    console.log(taskTitle);

    if (!taskTitle.includes(search)) {
      task.style.display = "none";
    }
  });
};

const filterTasks = (filterValue) => {
  const tasks = document.querySelectorAll(".task");

  switch (filterValue) {
    case "all":
      tasks.forEach((task) => (task.style.display = "flex"));

      break;

    case "done":
      tasks.forEach((task) =>
        task.classList.contains("done")
          ? (task.style.display = "flex")
          : (task.style.display = "none")
      );

      break;

    case "task":
      tasks.forEach((task) =>
        !task.classList.contains("done")
          ? (task.style.display = "flex")
          : (task.style.display = "none")
      );

      break;

    default:
      break;
  }
};

// Eventos
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = taskInput.value;

  if (inputValue) {
    saveTask(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let taskTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    taskTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-task")) {
    parentEl.classList.toggle("done");

    updateTaskStatusLocalStorage(taskTitle);
  }

  if (targetEl.classList.contains("remove-task")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removeTaskLocalStorage(taskTitle);
  }

  if (targetEl.classList.contains("edit-task")) {
    toggleForms();

    editInput.value = taskTitle;
    oldInputValue = taskTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTask(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  getSearchedTasks(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTasks(filterValue);
});

// Local Storage
const getTasksLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  return tasks;
};

const loadTasks = () => {
  const tasks = getTasksLocalStorage();

  tasks.forEach((task) => {
    saveTask(task.text, task.done, 0);
  });
};

const saveTaskLocalStorage = (task) => {
  const tasks = getTasksLocalStorage();

  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const removeTaskLocalStorage = (taskText) => {
  const tasks = getTasksLocalStorage();

  const filteredTasks = tasks.filter((task) => task.text != taskText);

  localStorage.setItem("tasks", JSON.stringify(filteredTasks));
};

const updateTaskStatusLocalStorage = (taskText) => {
  const tasks = getTasksLocalStorage();

  tasks.map((task) =>
    task.text === taskText ? (task.done = !task.done) : null
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTaskLocalStorage = (taskOldText, taskNewText) => {
  const tasks = getTasksLocalStorage();

  tasks.map((task) =>
    task.text === taskOldText ? (task.text = taskNewText) : null
  );

  localStorage.setItem("tasks", JSON.stringify(tasks));
};

loadTasks();
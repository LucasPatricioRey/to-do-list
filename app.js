let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const pendingEl = document.getElementById("pending");
const doneEl = document.getElementById("done");

function createTaskId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readTasks() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return Array.isArray(storedTasks) ? storedTasks : [];
  } catch {
    localStorage.removeItem("tasks");
    return [];
  }
}

let tasks = readTasks();

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getFilteredTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(task => !task.done);
  }

  if (currentFilter === "done") {
    return tasks.filter(task => task.done);
  }

  return tasks;
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (!filteredTasks.length) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent =
      currentFilter === "all"
        ? "Todavia no hay tareas. Agrega la primera."
        : "No hay tareas para este filtro.";
    taskList.appendChild(emptyState);
    updateCounter();
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    const taskText = document.createElement("span");
    taskText.className = `task-text ${task.done ? "done" : ""}`;
    taskText.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "icon-btn complete-btn";
    toggleButton.dataset.action = "toggle";
    toggleButton.dataset.id = task.id;
    toggleButton.setAttribute("aria-label", "Marcar tarea");
    toggleButton.textContent = task.done ? "↺" : "✓";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-btn delete-btn";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = task.id;
    deleteButton.setAttribute("aria-label", "Eliminar tarea");
    deleteButton.textContent = "×";

    actions.append(toggleButton, deleteButton);
    li.append(taskText, actions);

    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: createTaskId(),
    text,
    done: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map(task =>
    task.id === taskId ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  totalEl.textContent = `Total: ${tasks.length}`;
  pendingEl.textContent = `Pendientes: ${tasks.filter(task => !task.done).length}`;
  doneEl.textContent = `Hechas: ${tasks.filter(task => task.done).length}`;
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

taskList.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const { action, id } = button.dataset;

  if (action === "toggle") {
    toggleTask(id);
  }

  if (action === "delete") {
    deleteTask(id);
  }
});

document.querySelectorAll(".filters button").forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    document.querySelectorAll(".filters button").forEach(filterButton => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });

    renderTasks();
  });
});

tasks = tasks.map(task => ({
  id: task.id || createTaskId(),
  text: String(task.text || ""),
  done: Boolean(task.done)
}));

saveTasks();
renderTasks();

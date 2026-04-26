let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const pendingEl = document.getElementById("pending");
const doneEl = document.getElementById("done");

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

    li.innerHTML = `
      <span class="task-text ${task.done ? "done" : ""}">${task.text}</span>
      <div class="task-actions">
        <button type="button" class="icon-btn complete-btn" data-action="toggle" data-id="${task.id}" aria-label="Marcar tarea">
          ${task.done ? "↺" : "✓"}
        </button>
        <button type="button" class="icon-btn delete-btn" data-action="delete" data-id="${task.id}" aria-label="Eliminar tarea">
          ×
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
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
  id: task.id || crypto.randomUUID(),
  text: task.text,
  done: task.done
}));

saveTasks();
renderTasks();

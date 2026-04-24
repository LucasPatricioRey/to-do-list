let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalEl = document.getElementById("total");
const pendingEl = document.getElementById("pending");
const doneEl = document.getElementById("done");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (filter === "pending") {
    filtered = tasks.filter(t => !t.done);
  }

  if (filter === "done") {
    filtered = tasks.filter(t => t.done);
  }

  filtered.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="${task.done ? "done" : ""}">${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">🗑</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text,
    done: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function updateCounter() {
  totalEl.textContent = `Total: ${tasks.length}`;
  pendingEl.textContent = `Pendientes: ${tasks.filter(t => !t.done).length}`;
  doneEl.textContent = `Hechas: ${tasks.filter(t => t.done).length}`;
}

// EVENTOS
addBtn.addEventListener("click", addTask);

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    renderTasks(btn.dataset.filter);
  });
});

// INIT
renderTasks();
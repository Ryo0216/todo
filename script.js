// 初期設定
const taskInput = document.getElementById("task-input");
const taskPriority = document.getElementById("task-priority");
const taskDate = document.getElementById("task-date");
const taskGroup = document.getElementById("task-group");
const taskTime = document.getElementById("task-time");
const taskList = document.getElementById("task-list");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// ダークモード切り替え
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  saveDarkMode();
});

// ローカルストレージからダークモード設定を読み込む
function loadDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
}
loadDarkMode();

// タスクの保存
function saveTasks() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach(taskItem => {
    const taskText = taskItem.querySelector(".task-text").textContent;
    const priority = taskItem.querySelector(".task-priority").value;
    const date = taskItem.querySelector(".task-date").value;
    const time = taskItem.querySelector(".task-time").value;
    const group = taskItem.querySelector(".task-group").value;
    const completed = taskItem.classList.contains("completed");
    tasks.push({ text: taskText, priority, date, time, group, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// タスクをリストに追加
function addTaskToList(text, priority = 'low', date = '', time = '', group = 'work', completed = false) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item", `priority-${priority}`);
  if (completed) taskItem.classList.add("completed");

  taskItem.innerHTML = `
    <span class="task-text">${text}</span>
    <span class="task-priority">${priority}</span>
    <span class="task-date">${date}</span>
    <span class="task-time">${time}</span>
    <span class="task-group">${group}</span>
    <div class="task-actions">
      <button onclick="toggleComplete(this)">✓</button>
      <button onclick="deleteTask(this)" class="delete">Delete</button>
    </div>
  `;

  taskList.appendChild(taskItem);
  saveTasks();
}

// タスクを追加
function addTask() {
  const taskText = taskInput.value.trim();
  const priority = taskPriority.value;
  const date = taskDate.value;
  const time = taskTime.value;
  const group = taskGroup.value;

  if (taskText === "") return;
  addTaskToList(taskText, priority, date, time, group);
  
  taskInput.value = "";
  taskPriority.value = "low";
  taskDate.value = "";
  taskTime.value = "";
  taskGroup.value = "work";
}

// タスクの完了状態を切り替える
function toggleComplete(button) {
  const taskItem = button.closest(".task-item");
  taskItem.classList.toggle("completed");
  saveTasks();
}

// タスクを削除
function deleteTask(button) {
  const taskItem = button.closest(".task-item");
  taskItem.remove();
  saveTasks();
}

// 期限が近いタスクをリマインドする
function checkReminders() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    if (!task.completed && task.date && task.time) {
      const taskDateTime = new Date(`${task.date}T${task.time}`);
      const currentTime = new Date();
      const timeDifference = taskDateTime - currentTime;

      if (timeDifference <= 0 && timeDifference > -60000) {
        alert(`Reminder: ${task.text}`);
      }
    }
  });
}

// 保存されたタスク

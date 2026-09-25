// ==========================================
// CHECKLIST
// ==========================================

// Key used to save and retrieve checklist completion data
const checklistStorageKey = "tripflowChecklistV2";

// Store all checklist tasks in one JavaScript array
let checklistData = [];

// Create the visual DOM element for one checklist item
function createChecklistItem(task) {
  const checklistItem = document.createElement("div");

  checklistItem.classList.add("checklist-item");

  checklistItem.dataset.id = task.id;

  if (task.completed) {
    checklistItem.classList.add("completed");
  }

  checklistItem.innerHTML = `
  <span class="check-icon">
    <i class="fa-solid fa-check"></i>
  </span>

  <span class="check-text">${task.text}</span>

  <button class="delete-checklist-btn" type="button">
    <i class="fa-solid fa-trash"></i>
  </button>`;

  // Remove this task from checklistData when the delete button is clicked
  const deleteBtn = checklistItem.querySelector(".delete-checklist-btn");

  deleteBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    const taskId = Number(checklistItem.dataset.id);

    checklistData = checklistData.filter(function (task) {
      return task.id !== taskId;
    });

    saveChecklistProgress();

    renderChecklist();

    updateChecklistProgress();
  });

  // Handle completing and uncompleting this task
  checklistItem.addEventListener("click", function () {
    const taskId = Number(checklistItem.dataset.id);

    const task = checklistData.find(function (task) {
      return task.id === taskId;
    });

    if (!task) {
      return;
    }

    task.completed = !task.completed;

    saveChecklistProgress();

    renderChecklist();

    updateChecklistProgress();
  });

  return checklistItem;
}

// Render the checklist data and show an empty state when there are no tasks
function renderChecklist() {
  const checklistContainer = document.querySelector(".checklist-items");

  checklistContainer.innerHTML = "";

  if (checklistData.length === 0) {
    checklistContainer.innerHTML = `
      <div class="checklist-empty">
        <i class="fa-regular fa-clipboard"></i>
        <p>No tasks yet. Add something to prepare!</p>
      </div>
    `;

    return;
  }

  checklistData.forEach(function (task) {
    const checklistItem = createChecklistItem(task);

    checklistContainer.appendChild(checklistItem);
  });
}

// Find the element that displays the completed item count
const completedCount = document.querySelector(".completed-count");

// Find the element that displays the completion percentage
const completedPercentage = document.querySelector(".completed-percentage");

const notificationsRead = localStorage.getItem("notificationsRead");

// ==========================================
// CHECKLIST PROGRESS
// ==========================================

// Calculate and display checklist completion progress
function updateChecklistProgress() {
  const totalItems = checklistData.length;

  const completedTotal = checklistData.filter(function (task) {
    return task.completed;
  }).length;

  const percentage =
    totalItems === 0 ? 0 : Math.round((completedTotal / totalItems) * 100);

  completedCount.textContent = `${completedTotal} of ${totalItems} completed`;

  completedPercentage.textContent = `${percentage}%`;
}

// Save the current checklist data to localStorage
function saveChecklistProgress() {
  localStorage.setItem(checklistStorageKey, JSON.stringify(checklistData));
}

// Restore saved checklist data or initialize it from the default HTML tasks
function loadChecklistProgress() {
  const savedChecklist = localStorage.getItem(checklistStorageKey);

  if (savedChecklist) {
    checklistData = JSON.parse(savedChecklist);

    checklistData.forEach(function (task) {
      if (!task.id) {
        task.id = Date.now() + Math.random();
      }
    });

    saveChecklistProgress();

    renderChecklist();
    return;
  }

  const initialChecklistItems = document.querySelectorAll(".checklist-item");

  initialChecklistItems.forEach(function (item, index) {
    checklistData.push({
      id: Date.now() + index,
      text: item.querySelector(".check-text").textContent.trim(),
      completed: item.classList.contains("completed"),
    });
  });

  saveChecklistProgress();

  renderChecklist();
}

// Connect the new checklist input and Add button to JavaScript
const checklistInput = document.querySelector("#checklistInput");

const addChecklistBtn = document.querySelector("#addChecklistBtn");

// Create a new task, add it to checklistData, save it, and render the checklist
function addChecklistItem() {
  const taskText = checklistInput.value.trim();

  if (taskText === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  checklistData.push(newTask);

  saveChecklistProgress();

  renderChecklist();

  updateChecklistProgress();

  checklistInput.value = "";
}

// Run addChecklistItem() whenever the user clicks the Add button
addChecklistBtn.addEventListener("click", function () {
  addChecklistItem();
});

// Allow users to add a checklist item by pressing Enter
checklistInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addChecklistItem();
  }
});

// Restore previously saved checklist state before calculating progress
loadChecklistProgress();

// Calculate the initial checklist progress
updateChecklistProgress();

// Adding interaction to the "view Itenerary" button.

const viewItineraryBtn = document.querySelector("#viewItineraryBtn");

const timelineSection = document.querySelector("#timeline");

viewItineraryBtn.addEventListener("click", function () {
  timelineSection.scrollIntoView({
    behavior: "smooth",
  });
});

const notificationBtn = document.querySelector("#notificationBtn");

const notificationPanel = document.querySelector("#notificationPanel");

const notificationBadge = document.querySelector("#notificationBadge");

const notificationItems = document.querySelectorAll(".notification-item");

notificationBtn.addEventListener("click", function () {
  notificationPanel.classList.toggle("show");
  if (notificationPanel.classList.contains("show")) {
    notificationItems.forEach(function (notification) {
      notification.dataset.read = "true";
    });

    updateNotificationBadge();

    localStorage.setItem("notificationsRead", "true");
  }
});

document.addEventListener("click", function (event) {
  if (
    !notificationBtn.contains(event.target) &&
    !notificationPanel.contains(event.target)
  ) {
    notificationPanel.classList.remove("show");
  }
});

// Update the notification badge based on the number of unread notifications
function updateNotificationBadge() {
  const unreadNotifications = document.querySelectorAll(
    '.notification-item[data-read="false"]',
  );

  notificationBadge.textContent = unreadNotifications.length;

  notificationBadge.style.display =
    unreadNotifications.length > 0 ? "flex" : "none";
}

if (notificationsRead === "true") {
  notificationItems.forEach(function (notification) {
    notification.dataset.read = "true";
  });
}

updateNotificationBadge();

// ==========================================
// WEATHER
// ==========================================
// Track whether weather data is currently being loaded

// Store the complete Weather component state in one object
const weatherState = {
  loading: false,
  error: false,
  data: {
    location: "Bali, Indonesia",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 72,
    windSpeed: 14,
    icon: "fa-cloud-sun",
  },
};

const weatherStates = [
  {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 72,
    windSpeed: 14,
    icon: "fa-cloud-sun",
  },
  {
    temperature: 30,
    condition: "Sunny",
    humidity: 65,
    windSpeed: 11,
    icon: "fa-sun",
  },
  {
    temperature: 26,
    condition: "Light Rain",
    humidity: 80,
    windSpeed: 18,
    icon: "fa-cloud-rain",
  },
];

const weatherRefreshBtn = document.querySelector("#weatherRefreshBtn");

// Display weatherData values in the Weather widget
// Render the current Weather state into the UI
function renderWeather() {
  const weatherLocation = document.querySelector("#weatherLocation");
  const weatherTemperature = document.querySelector("#weatherTemperature");
  const weatherCondition = document.querySelector("#weatherCondition");
  const weatherIcon = document.querySelector("#weatherIcon");
  const weatherHumidity = document.querySelector("#weatherHumidity");
  const weatherWind = document.querySelector("#weatherWind");

  if (weatherState.loading) {
    weatherCondition.textContent = "Loading...";
    return;
  }

  if (weatherState.error) {
    weatherCondition.textContent = "Unable to fetch weather";
    return;
  }

  const weatherData = weatherState.data;

  weatherLocation.textContent = weatherData.location;
  weatherTemperature.textContent = weatherData.temperature;
  weatherCondition.textContent = weatherData.condition;
  weatherHumidity.textContent = `${weatherData.humidity}%`;
  weatherWind.textContent = `${weatherData.windSpeed} km/h`;
  weatherIcon.className = `fa-solid ${weatherData.icon} weather-icon`;
}

renderWeather();

// Refresh the weather data
// Refresh weather data and handle loading, success, and error states
weatherRefreshBtn.addEventListener("click", function () {
  weatherState.loading = true;
  weatherState.error = false;

  renderWeather();

  setTimeout(function () {
    const hasError = Math.random() < 0.2;

    if (hasError) {
      weatherState.loading = false;
      weatherState.error = true;

      renderWeather();

      alert("Unable to fetch weather. Please try again.");

      return;
    }

    const randomIndex = Math.floor(Math.random() * weatherStates.length);

    const newWeather = weatherStates[randomIndex];

    weatherState.data.temperature = newWeather.temperature;
    weatherState.data.condition = newWeather.condition;
    weatherState.data.humidity = newWeather.humidity;
    weatherState.data.windSpeed = newWeather.windSpeed;
    weatherState.data.icon = newWeather.icon;

    weatherState.loading = false;
    weatherState.error = false;

    renderWeather();

    alert("Weather updated successfully!");
  }, 1000);
});

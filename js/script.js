// ==========================================
// CHECKLIST
// ==========================================

// Key used to save and retrieve checklist completion data
const checklistStorageKey = "tripflowChecklistV2";

// Find the element that displays the completed item count
const completedCount = document.querySelector(".completed-count");

// Find the element that displays the completion percentage
const completedPercentage = document.querySelector(".completed-percentage");

const notificationsRead = localStorage.getItem("notificationsRead");

// ==========================================
// CHECKLIST PROGRESS
// ==========================================

function updateChecklistProgress() {
  const completedItems = document.querySelectorAll(".checklist-item.completed");

  const completedTotal = completedItems.length;

  const totalItems = document.querySelectorAll(".checklist-item").length;

  const percentage = Math.round((completedTotal / totalItems) * 100);

  completedCount.textContent = `${completedTotal} of ${totalItems} completed`;

  completedPercentage.textContent = `${percentage}%`;
}

// Save both the task text and completion state of every checklist item
function saveChecklistProgress() {
  const currentItems = document.querySelectorAll(".checklist-item");

  const checklistState = [];

  currentItems.forEach(function (item) {
    checklistState.push({
      text: item.querySelector(".check-text").textContent,
      completed: item.classList.contains("completed"),
    });
  });

  localStorage.setItem(checklistStorageKey, JSON.stringify(checklistState));
}

// Restore the checklist state saved in localStorage
// Restore the complete checklist from localStorage
function loadChecklistProgress() {
  const savedChecklist = localStorage.getItem(checklistStorageKey);

  if (!savedChecklist) {
    return;
  }

  const checklistState = JSON.parse(savedChecklist);

  const checklistContainer = document.querySelector(".checklist-items");

  checklistContainer.innerHTML = "";

  checklistState.forEach(function (item) {
    const checklistItem = document.createElement("div");

    checklistItem.classList.add("checklist-item");

    if (item.completed) {
      checklistItem.classList.add("completed");
    }

    checklistItem.innerHTML = `
            <span class="check-icon">
                <i class="fa-solid fa-check"></i>
            </span>
            <span class="check-text">${item.text}</span>
        `;

    checklistItem.addEventListener("click", function () {
      checklistItem.classList.toggle("completed");

      updateChecklistProgress();
      saveChecklistProgress();
    });

    checklistContainer.appendChild(checklistItem);
  });
}

// Connect the new checklist input and Add button to JavaScript
const checklistInput = document.querySelector("#checklistInput");

const addChecklistBtn = document.querySelector("#addChecklistBtn");

// Create a new checklist item and add it to the existing checklist
function addChecklistItem() {
  // Get the text typed by the user and remove unnecessary spaces
  const taskText = checklistInput.value.trim();

  // Stop if the user tries to add an empty task
  if (taskText === "") {
    return;
  }

  // Create the main container for the new checklist item
  const checklistItem = document.createElement("div");

  // Give the new element the same class as our existing checklist items
  checklistItem.classList.add("checklist-item");

  // Create the circular check icon container
  const checkIcon = document.createElement("span");

  checkIcon.classList.add("check-icon");

  // Create the Font Awesome check icon
  const icon = document.createElement("i");

  icon.classList.add("fa-solid", "fa-check");

  // Put the icon inside the circular check container
  checkIcon.appendChild(icon);

  // Create the text element for the task
  const checkText = document.createElement("span");

  checkText.classList.add("check-text");

  // Put the user's typed task inside the text element
  checkText.textContent = taskText;

  // Put the check icon and task text inside the checklist item
  checklistItem.appendChild(checkIcon);
  checklistItem.appendChild(checkText);

  // Add the completed/uncompleted click behavior to the new item
  checklistItem.addEventListener("click", function () {
    checklistItem.classList.toggle("completed");

    updateChecklistProgress();

    saveChecklistProgress();
  });

  // Add the newly created item to the checklist container
  document.querySelector(".checklist-items").appendChild(checklistItem);

  // Clear the input after successfully adding the task
  checklistInput.value = "";

  // Update the progress because the total number of items changed
  updateChecklistProgress();

  // Save the updated checklist state
  saveChecklistProgress();
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

// Add click behavior to the checklist items already present in HTML
const initialChecklistItems = document.querySelectorAll(".checklist-item");

initialChecklistItems.forEach(function (item) {
  item.addEventListener("click", function () {
    item.classList.toggle("completed");

    updateChecklistProgress();
    saveChecklistProgress();
  });
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

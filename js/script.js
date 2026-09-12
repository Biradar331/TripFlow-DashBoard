// ==========================================
// CHECKLIST
// ==========================================

// Find all checklist items from the HTML
const checklistItems = document.querySelectorAll(".checklist-item");

// Key used to save and retrieve checklist completion data
const checklistStorageKey = "tripflowChecklist";

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

  const totalItems = checklistItems.length;

  const percentage = Math.round((completedTotal / totalItems) * 100);

  completedCount.textContent = `${completedTotal} of ${totalItems} completed`;

  completedPercentage.textContent = `${percentage}%`;
}

updateChecklistProgress();

// Save the current completed/not-completed state of every checklist item
function saveChecklistProgress() {
  const checklistState = [];

  checklistItems.forEach(function (item) {
    checklistState.push(item.classList.contains("completed"));
  });

  localStorage.setItem(checklistStorageKey, JSON.stringify(checklistState));
}

checklistItems.forEach(function (item) {
  item.addEventListener("click", function () {
    item.classList.toggle("completed");
    updateChecklistProgress();
    saveChecklistProgress();
  });
});

// Restore the checklist state saved in localStorage
function loadChecklistProgress() {
  const savedChecklist = localStorage.getItem(checklistStorageKey);

  if (savedChecklist) {
    const checklistState = JSON.parse(savedChecklist);

    checklistItems.forEach(function (item, index) {
      if (checklistState[index]) {
        item.classList.add("completed");
      }
    });
  }
}

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

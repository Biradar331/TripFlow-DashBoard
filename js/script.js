const checklistItems = document.querySelectorAll(".checklist-item");

const completedCount = document.querySelector(".completed-count");
const completedPercentage = document.querySelector(".completed-percentage");

function updateChecklistProgress() {
  const completedItems = document.querySelectorAll(".checklist-item.completed");

  const completedTotal = completedItems.length;

  const totalItems = checklistItems.length;

  const percentage = Math.round((completedTotal / totalItems) * 100);

  completedCount.textContent = `${completedTotal} of ${totalItems} completed`;

  completedPercentage.textContent = `${percentage}%`;
}

updateChecklistProgress();

checklistItems.forEach(function (item) {
  item.addEventListener("click", function () {
    item.classList.toggle("completed");
    updateChecklistProgress();
  });
});

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

function updateNotificationBadge() {
  const unreadNotifications = document.querySelectorAll(
    '.notification-item[data-read="false"]',
  );

  notificationBadge.textContent = unreadNotifications.length;

  notificationBadge.style.display =
    unreadNotifications.length > 0 ? "flex" : "none";
}
updateNotificationBadge();

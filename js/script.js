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

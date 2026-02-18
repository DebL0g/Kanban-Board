let cardCounter = 10;

// Reusable function to attach drag events to any card
function setupDragging(card) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
}

// Set up dragging on all existing cards
const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");

for (const card of cards) setupDragging(card);

for (const list of lists) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
}

function dragStart(e) {
    e.dataTransfer.setData("text/plain", this.id);
}
function dragEnd() {}
function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); this.classList.add("over"); }
function dragLeave() { this.classList.remove("over"); }
function dragDrop(e) {
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);
    const container = this.querySelector(".cards-container"); // drop into the cards area, not the whole list
    container.appendChild(card);
    this.classList.remove("over");
}

// Add task logic — runs for each column independently
document.querySelectorAll(".add-task-area").forEach(area => {
    const input = area.querySelector(".add-task-input");
    const addBtn = area.querySelector(".add-task-btn");
    const confirmBtn = area.querySelector(".confirm-btn");
    const container = area.closest(".list").querySelector(".cards-container");

    // Clicking "+ Add a card" reveals the input
    addBtn.addEventListener("click", () => {
        input.style.display = "block";
        confirmBtn.style.display = "block";
        addBtn.style.display = "none";
        input.focus();
    });

    function submitTask() {
        const text = input.value.trim();
        if (text) {
            // Create a brand new card element
            const card = document.createElement("div");
            card.className = "card";
            card.draggable = true;
            card.id = "card" + (++cardCounter); // give it a unique id
            card.textContent = text;
            setupDragging(card); // make it draggable like the others
            container.appendChild(card);
        }
        // Reset the input area back to just the button
        input.value = "";
        input.style.display = "none";
        confirmBtn.style.display = "none";
        addBtn.style.display = "block";
    }

    confirmBtn.addEventListener("click", submitTask);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") submitTask();   // Enter to confirm
        if (e.key === "Escape") {              // Escape to cancel
            input.value = "";
            input.style.display = "none";
            confirmBtn.style.display = "none";
            addBtn.style.display = "block";
        }
    });
});
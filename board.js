let cardCounter = 10;

function setupDragging(card) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
}

const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".list");
const trashZone = document.getElementById("trash-zone");

for (const card of cards) setupDragging(card);

for (const list of lists) {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
}

// --- Trash zone events ---

// Show trash zone when any drag starts
document.addEventListener("dragstart", () => {
    trashZone.classList.add("visible");
});

// Hide trash zone when drag ends (dropped or cancelled)
document.addEventListener("dragend", () => {
    trashZone.classList.remove("visible");
    trashZone.classList.remove("danger");
});

// Highlight red when hovering over trash
trashZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

trashZone.addEventListener("dragenter", (e) => {
    e.preventDefault();
    trashZone.classList.add("danger");
});

trashZone.addEventListener("dragleave", () => {
    trashZone.classList.remove("danger");
});

// Delete the card when dropped on trash
trashZone.addEventListener("drop", (e) => {
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);
    if (card) {
        card.classList.add("deleting"); // trigger fade out animation
        setTimeout(() => card.remove(), 300); // remove after animation
    }
    trashZone.classList.remove("danger");
});

// --- Existing drag functions ---

function dragStart(e) {
    e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {
    trashZone.classList.remove("visible");
    trashZone.classList.remove("danger");
}

function dragOver(e) { e.preventDefault(); }
function dragEnter(e) { e.preventDefault(); this.classList.add("over"); }
function dragLeave() { this.classList.remove("over"); }

function dragDrop(e) {
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);
    const container = this.querySelector(".cards-container");
    container.appendChild(card);
    this.classList.remove("over");
}

// --- Add task logic ---

document.querySelectorAll(".add-task-area").forEach(area => {
    const input = area.querySelector(".add-task-input");
    const addBtn = area.querySelector(".add-task-btn");
    const confirmBtn = area.querySelector(".confirm-btn");
    const container = area.closest(".list").querySelector(".cards-container");

    addBtn.addEventListener("click", () => {
        input.style.display = "block";
        confirmBtn.style.display = "block";
        addBtn.style.display = "none";
        input.focus();
    });

    function submitTask() {
        const text = input.value.trim();
        if (text) {
            const card = document.createElement("div");
            card.className = "card";
            card.draggable = true;
            card.id = "card" + (++cardCounter);
            card.textContent = text;
            setupDragging(card);
            container.appendChild(card);
        }
        input.value = "";
        input.style.display = "none";
        confirmBtn.style.display = "none";
        addBtn.style.display = "block";
    }

    confirmBtn.addEventListener("click", submitTask);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") submitTask();
        if (e.key === "Escape") {
            input.value = "";
            input.style.display = "none";
            confirmBtn.style.display = "none";
            addBtn.style.display = "block";
        }
    });
});
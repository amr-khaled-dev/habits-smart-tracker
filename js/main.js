let appState = {
    habits: new Map(),
    habitNames: new Set(),
    lastActiveDate: null,
    filters: {
        status: "all",      // all, active, paused, completed
        q: ""
    },
    ui: {
        theme: 'light',     // light || dark
        notifications: true
    }
};
let StatsEngine = {
    getHabits() { return Array.from(appState.habits.values()); },
    today() {
        const habits = this.getHabits();
        const total = habits.length;
        const completed = habits.filter(h => h.progress >= h.target).length;
        const completionRate = total ? Math.round((completed / total) * 100) : 0;
        const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0);
        return { total, completed, completionRate, longestStreak };
    }
};
let habitNameRegex = /^[a-zA-Z0-9 ]{3,30}$/;
let habitInput = document.getElementById("habitInput");
let targetInput = document.getElementById("targetInput");
let habitsList = document.getElementById("habitsList");
let habitCounter = document.getElementById("habitCounter");
let filtersDiv = document.getElementById("filters");
let notifiToast = document.getElementById("notifiToast");
let togglersDiv = document.getElementById("togglers");
let notifiIcon = document.getElementById("notifiIcon");
let themeIcon = document.getElementById("themeIcon");
let inputDialog = document.getElementById("inputDialog");
let openDialogBtn = document.getElementById("openDialogBtn");
let closeDialogBtn = document.getElementById("closeDialogBtn");
let cancelHabitBtn = document.getElementById("cancelHabitBtn");
let habitForm = document.getElementById("habitForm");
let habitPriority = document.getElementById("habitPriority");
let tagsInput = document.getElementById("tagsInput");
let searchInput = document.getElementById("searchInput");
let clearFiltersBtn = document.getElementById("clearFiltersBtn");
let deletedHabit = null;
let draggingHabitId = null;
let dropPosition = null;    // before, after
let habitsSaveTimer = null;
let metaSaveTimer = null;
let searchTimer = null;

import { dbPutHabit, dbPutHabitsBulk, dbGetAllHabits, dbDeleteHabit, dbSetAllMeta, dbGetAllMeta } from "./db.js";

//Create a new habit object
function createHabit({ name, target = 1, frequency = "daily", priority = "low", tags = [] }) {
    return {
        id: Date.now(),
        name,
        cleanName: name.trim().toLowerCase(),
        target,
        frequency,          // daily, weekly
        priority,           // low, medium, high
        tags,
        progress: 0,
        streak: 0,
        status: "active",   // active, paused, completed
        order: Date.now(),
        periodKey: frequency === "daily" ? getTodayKey() : getWeekKey(),
        createdAt: new Date().toISOString()
    };
}

//Validate habit name
function isValidHabitName(name) {
    return habitNameRegex.test(name.trim());
}

//Add a new habit to the app state
function addHabit({ name, target, frequency, priority, tags }) {
    const cleanName = name.trim().toLowerCase();
    if (!isValidHabitName(name)) return false;
    if (appState.habitNames.has(cleanName)) return false;
    const newHabit = createHabit({ name, target, frequency, priority, tags });
    appState.habits.set(newHabit.id, newHabit);
    appState.habitNames.add(newHabit.cleanName);
    showToast("Habit added successfully.", "info");
    return { ...newHabit };
}

//Increment habit progress
function incrementHabit(id) {
    const habit = appState.habits.get(id);
    if (!habit) return;
    if (habit.frequency === "weekly") {
        if (habit.periodKey !== getWeekKey()) { habit.progress = 0; habit.status = "active"; habit.periodKey = getWeekKey(); }
    } else {
        if (habit.periodKey !== getTodayKey()) { habit.progress = 0; habit.status = "active"; habit.periodKey = getTodayKey(); }
    }
    if (habit.status === "paused") return;
    if (habit.status === "completed") return;
    habit.progress = Math.min(habit.progress + 1, habit.target);
    if (habit.progress >= habit.target) {
        habit.streak += 1;
        habit.status = "completed";
        showToast("Congratulations! Habit completed.", "success");
    }
}

//Toggle habit status between active and paused
function toggleHabitStatus(id) {
    const habit = appState.habits.get(id);
    if (habit.status === "completed") return;
    habit.status = habit.status === "paused" ? "active" : "paused";
    showToast(habit.status === "paused" ? "Habit paused" : "Habit resumed", "info");
}

//Remove a habit from the app state
function removeHabit(id) {
    deletedHabit = appState.habits.get(id);
    if (!deletedHabit) return;
    appState.habits.delete(id);
    appState.habitNames.delete(deletedHabit.cleanName);
    dbDeleteHabit(id);
    showToast("Habit removed successfully.", "attention");
}

//Handle drag and drop functionality for habit Items
function handleDragStart(e) {
    draggingHabitId = this.dataset.id;
    this.classList.add("dragging");
}

function handleDragEnd(e) {
    this.classList.remove("dragging");
    clearDropIndicators();
    draggingHabitId = null;
}

function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
}

function handleDragLeave(e) {
    this.classList.remove("drag-over");
}

function handleDragOver(e) {
    e.preventDefault();
    if (this.classList.contains("dragging")) return;
    clearDropIndicators();
    dropPosition = getDropPosition(e, this);
    this.classList.add(dropPosition === "before" ? "drop-before" : "drop-after");
    this.dataset.dropPosition = dropPosition;
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    const targetHabitId = this.dataset.id;
    clearDropIndicators();
    if (!draggingHabitId || draggingHabitId === targetHabitId) return;
    reorderHabits(draggingHabitId, targetHabitId, dropPosition);
    renderHabits();
    scheduleHabitsSave();
}

function getDropPosition(e, element) {
    const rect = element.getBoundingClientRect();
    const middleX = rect.left + rect.width / 2;
    return e.clientX < middleX ? "before" : "after";
}

function clearDropIndicators() {
    document.querySelectorAll(".habit-item")
        .forEach(item => item.classList.remove("drop-before", "drop-after"));
}

function reorderHabits(draggedId, targetId, dropPosition) {
    const habits = Array.from(appState.habits.values()).sort((a, b) => a.order - b.order);
    const draggedIndex = habits.findIndex(h => h.id === Number(draggedId));
    const targetIndex = habits.findIndex(h => h.id === Number(targetId));
    if (draggedIndex === -1 || targetIndex === -1) return;
    const [movedHabit] = habits.splice(draggedIndex, 1);
    let insertIndex = targetIndex;
    if (dropPosition === "after") {
        insertIndex = targetIndex + (draggedIndex < targetIndex ? 0 : 1);
    } else {
        insertIndex = targetIndex - (draggedIndex < targetIndex ? 1 : 0);
    }
    habits.splice(insertIndex, 0, movedHabit);
    habits.forEach((habit, index) => habit.order = index);
}

function attachDragEvents(li) {
    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragenter", handleDragEnter);
    li.addEventListener("dragleave", handleDragLeave);
    li.addEventListener("dragover", handleDragOver);
    li.addEventListener("drop", handleDrop);
    li.addEventListener("dragend", handleDragEnd);
}

//Update habit counter cards
function updateCounter() {
    const { total, completed, completionRate } = StatsEngine.today();
    renderCounter(total, completed, completionRate);
    updateTitle();
}

//Update title with habit progress
function updateTitle() {
    const { total, completed, longestStreak } = StatsEngine.today();
    if (!total) {
        document.title = "Smart Tracker";
        return;
    }
    document.title =
        `Smart Tracker — Today: ${completed}/${total} ✅ | ` +
        `Best Streak 🔥 ${longestStreak}`;
}

//Notification and Theme toggler functions
function notificationsToggler() {
    if (appState.ui.notifications) {
        showToast("Notifications disabled.", "info");
        notifiIcon.classList.remove("fa-bell");
        notifiIcon.classList.add("fa-bell-slash");
        appState.ui.notifications = false;
    } else {
        appState.ui.notifications = true;
        notifiIcon.classList.remove("fa-bell-slash");
        notifiIcon.classList.add("fa-bell");
        showToast("Notifications enabled.", "info");
    }
    scheduleMetaSave();
}

function themeToggler() {
    if (appState.ui.theme === "light") {
        appState.ui.theme = "dark";
        document.body.classList.add("dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun", "active");
        showToast("Dark theme enabled.", "info");
    } else {
        appState.ui.theme = "light";
        document.body.classList.remove("dark");
        themeIcon.classList.remove("fa-sun", "active");
        themeIcon.classList.add("fa-moon");
        showToast("Light theme enabled.", "info");
    }
    scheduleMetaSave();
}

function pad2(num) {
    return String(num).padStart(2, "0");
}

//Get today's date key in YYYY-MM-DD format
function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function getWeekKey() {
    const d = new Date();
    const dayIndex = d.getDay();    // 0 (Sun) to 6 (Sat)
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - dayIndex);
    return `${sunday.getFullYear()}-${pad2(sunday.getMonth() + 1)}-${pad2(sunday.getDate())}`;
}

//Get selected frequency
function getSelectedFrequency() {
    return document.querySelector('input[name="habitFrequency"]:checked')?.value || "daily";
}

//Parse tags
function parseTags(raw) {
    return raw.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean);
}

//Get habits based on filter
function getHabits(filter = "all", searchQuery = "") {
    let habitsArray = Array.from(appState.habits.values());
    let query = searchQuery.trim().toLowerCase();
    if (filter !== "all") {
        habitsArray = habitsArray.filter(habit => habit.status === filter);
    }
    if (query) {
        habitsArray = habitsArray.filter(
            habit => habit.cleanName.includes(query) ||
                habit.tags.some(tag => tag.includes(query)));
    }
    return habitsArray.sort((a, b) => a.order - b.order);
}

//Handling new habit addition from input to app state and UI
function handleAddHabit() {
    const name = habitInput.value.trim();
    const target = Number(targetInput.value) || 1;
    const frequency = getSelectedFrequency();
    const priority = habitPriority.value;
    const tags = parseTags(tagsInput.value);
    const result = addHabit({ name, target, frequency, priority, tags });
    if (!result) {
        showToast("Invalid habit name or habit already exists.", "error");
        return;
    }
    renderHabits();
    scheduleHabitsSave();
}

//Render a habit item
function renderHabit(habit) {
    const { id, name, progress, target, tags, status } = habit;

    const li = document.createElement("li");
    li.classList.add("habit-item", `habit-${status}`);
    li.dataset.id = id;
    li.draggable = true;
    li.dataset.status = status;
    if (status === "completed") {
        li.draggable = false;
        li.classList.add("drag-disabled");
    };

    const dragHandle = document.createElement("i");
    dragHandle.classList.add("fa-solid", "fa-grip-vertical", "drag-handle");
    dragHandle.setAttribute("aria-label", "Drag to reorder");
    dragHandle.dataset.action = "drag";

    const nameSpan = document.createElement("span");
    nameSpan.classList.add("habit-name");
    nameSpan.textContent = name;

    const progressFrequencyContainer = document.createElement("div");
    progressFrequencyContainer.classList.add("progress-frequency-container");

    const progressSpan = document.createElement("span");
    progressSpan.classList.add("habitProgress");
    progressSpan.textContent = `${progress} / ${target}`;

    const frequencySpan = document.createElement("span");
    frequencySpan.classList.add("habit-frequency");
    frequencySpan.textContent = habit.frequency === "daily" ? "Today" : "This Week";

    progressFrequencyContainer.append(frequencySpan, progressSpan);

    const progressIncrementContainer = document.createElement("div");
    progressIncrementContainer.classList.add("progress-increment-container");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");
    const progressPercent = (progress / target) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressBar.appendChild(progressFill);

    const tagsPriorityContainer = document.createElement("div");
    tagsPriorityContainer.classList.add("tags-priority-container");

    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("habit-tags");

    const priorityContainer = document.createElement("div");
    priorityContainer.classList.add("habit-priorities");

    for (const tag of tags) {
        if (tagsContainer.children.length >= 2) {
            const tagSpan = document.createElement("span");
            tagSpan.classList.add("habit-tag");
            tagSpan.textContent = `+${tags.length - 2}`;
            tagsContainer.appendChild(tagSpan);
            break;
        }
        const tagSpan = document.createElement("span");
        tagSpan.classList.add("habit-tag");
        tagSpan.textContent = `# ${tag}`;
        tagsContainer.appendChild(tagSpan);
    }

    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("habit-priority");
    prioritySpan.textContent = habit.priority;
    if (prioritySpan.textContent === "low") prioritySpan.classList.add("low");
    if (prioritySpan.textContent === "medium") prioritySpan.classList.add("medium");
    if (prioritySpan.textContent === "high") prioritySpan.classList.add("high");
    priorityContainer.appendChild(prioritySpan);

    tagsPriorityContainer.append(tagsContainer, priorityContainer);

    const incrementBtn = document.createElement("button");
    incrementBtn.classList.add("increment");
    incrementBtn.dataset.action = "increment";
    incrementBtn.textContent = "+1";
    status !== "active" ? incrementBtn.disabled = true : incrementBtn.disabled = false;

    const toggleStatusBtn = document.createElement("button");
    toggleStatusBtn.classList.add("habit-btn", "toggle-status");
    toggleStatusBtn.dataset.action = "toggleStatus";
    toggleStatusBtn.textContent = status === "paused" ? "Resume" : "Pause";
    const statusIcon = document.createElement("i");
    statusIcon.className = status === "paused" ? "fa-solid fa-play" : "fa-solid fa-pause";
    if (status === "completed") toggleStatusBtn.style.display = "none";
    toggleStatusBtn.prepend(statusIcon);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("habit-btn", "delete");
    deleteBtn.dataset.action = "delete";
    const trashIcon = document.createElement("i");
    trashIcon.className = "fa-solid fa-trash";
    deleteBtn.appendChild(trashIcon);

    const habitBtnsContainer = document.createElement("div");
    habitBtnsContainer.classList.add("habit-btns-container");
    habitBtnsContainer.append(toggleStatusBtn, deleteBtn);

    progressIncrementContainer.append(progressBar, incrementBtn);

    li.append(dragHandle, nameSpan, progressFrequencyContainer, progressIncrementContainer, tagsPriorityContainer, habitBtnsContainer);
    return li;
}

//Render habits list based on filter
function renderHabits() {
    if (!habitsList) return;
    habitsList.innerHTML = "";
    const habitsToRender = getHabits(appState.filters.status, appState.filters.q);
    habitsToRender.forEach(habit => {
        const li = renderHabit(habit);
        attachDragEvents(li);
        habitsList.appendChild(li);
    });
    updateCounter();
}

//Render habit counter cards
function renderCounter(total, completed, completionRate) {
    habitCounter.innerHTML = "";
    const totalCard = document.createElement("div");
    totalCard.classList.add("counter-card", "total");
    const totalParagraph = document.createElement("p");
    totalParagraph.textContent = "Total Habits";
    const totalValue = document.createElement("span");
    totalValue.textContent = total;
    const totalIcon = document.createElement("i");
    totalIcon.classList.add("fa-solid", "fa-wave-square", "fa-2x");
    const totalContainer = document.createElement("div");
    totalContainer.classList.add("inner-container");
    totalContainer.append(totalValue, totalIcon);
    totalCard.append(totalParagraph, totalContainer);

    const completedCard = document.createElement("div");
    completedCard.classList.add("counter-card", "completed");
    const completedParagraph = document.createElement("p");
    completedParagraph.textContent = "Completed Today";
    const completedValue = document.createElement("span");
    completedValue.textContent = completed;
    const completedIcon = document.createElement("i");
    completedIcon.classList.add("fa-solid", "fa-trophy", "fa-2x");
    const completedContainer = document.createElement("div");
    completedContainer.classList.add("inner-container");
    completedContainer.append(completedValue, completedIcon);
    completedCard.append(completedParagraph, completedContainer);

    const rateCard = document.createElement("div");
    rateCard.classList.add("counter-card", "rate");
    const rateParagraph = document.createElement("p");
    rateParagraph.textContent = "Completion Rate";
    const rateValue = document.createElement("span");
    rateValue.textContent = `${completionRate}%`;
    const rateIcon = document.createElement("i");
    rateIcon.classList.add("fa-solid", "fa-chart-line", "fa-2x");
    const rateContainer = document.createElement("div");
    rateContainer.classList.add("inner-container");
    rateContainer.append(rateValue, rateIcon);
    rateCard.append(rateParagraph, rateContainer);

    habitCounter.append(totalCard, completedCard, rateCard);
}

//Filtering habits based on filter button click and search input
filtersDiv.addEventListener("click", e => {
    const filter = e.target.closest("button")?.dataset.filter;
    if (!filter) return;
    appState.filters.status = filter;
    updateActiveFilter();
    renderHabits();
    scheduleMetaSave();
})

searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        appState.filters.q = searchInput.value.trim().toLowerCase();
        renderHabits();
        scheduleMetaSave();
    }, 200);
})

//Clear filters and search input
clearFiltersBtn.addEventListener("click", () => {
    appState.filters.status = "all";
    appState.filters.q = "";
    searchInput.value = "";
    updateActiveFilter();
    renderHabits();
    scheduleMetaSave();
})

//Add habit increment and delete event listener
habitsList.addEventListener("click", e => {
    const action = e.target.closest("button")?.dataset.action;
    const habitItem = e.target.closest("li");
    if (!action || !habitItem) return;
    const habitId = Number(habitItem.dataset.id);
    let shouldRender = false;
    if (action === "increment") {
        incrementHabit(habitId);
        shouldRender = true;
    }
    else if (action === "toggleStatus") {
        toggleHabitStatus(habitId);
        shouldRender = true;
    }
    else if (action === "delete") {
        removeHabit(habitId);
        shouldRender = true;
    }
    if (shouldRender) {
        renderHabits();
        scheduleHabitsSave();
    };
});

//Add habit by submitting form
habitForm.addEventListener("submit", e => {
    e.preventDefault();
    handleAddHabit();
    inputDialog.close();
    habitForm.reset();
});

//Notification & Theme toggler
togglersDiv.addEventListener("click", e => {
    if (e.target.closest(".notifi-toggler")) notificationsToggler();
    if (e.target.closest(".theme-toggler")) themeToggler();
});

//Clear inputs and toasts on Escape key press
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        habitInput.value = "";
        targetInput.value = "";
        habitInput.focus();
        [...notifiToast.children].forEach(toast => toast.remove());
    }
});

//Open dialog on add button click
openDialogBtn.addEventListener("click", () => {
    inputDialog.showModal();
    habitForm.reset();
    habitInput.focus();
})

//Close dialog via close button or cancel button click
closeDialogBtn.addEventListener("click", () => {
    inputDialog.close();
})

cancelHabitBtn.addEventListener("click", () => {
    inputDialog.close();
})

//Update active filter button UI
function updateActiveFilter() {
    document.querySelectorAll(".filters button")
        .forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.filter === appState.filters.status
            );
        });
}

//Apply saved theme and notification settings on load
function applyTheme() {
    if (appState.ui.theme === "dark") {
        document.body.classList.add("dark");
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun", "active");
    } else {
        document.body.classList.remove("dark");
        themeIcon.classList.remove("fa-sun", "active");
        themeIcon.classList.add("fa-moon");
    }
}

function applyNotifications() {
    if (appState.ui.notifications) {
        notifiIcon.classList.remove("fa-bell-slash");
        notifiIcon.classList.add("fa-bell");
    } else {
        notifiIcon.classList.remove("fa-bell");
        notifiIcon.classList.add("fa-bell-slash");
    }
}

//Daily reset
function resetProgressIfNewPeriod() {
    let didReset = false;
    appState.habits.forEach(habit => {
        const expectedKey = habit.frequency === "daily" ? getTodayKey() : getWeekKey();
        if (habit.periodKey === expectedKey) return;
        if (habit.progress < habit.target) habit.streak = 0;
        habit.progress = 0;
        if (habit.status === "completed") habit.status = "active";
        habit.periodKey = expectedKey;
        didReset = true;
    });
    if (didReset) {
        showToast("Habits progress reset 🌅", "info");
        appState.lastActiveDate = getTodayKey();
        scheduleMetaSave();
    }
    scheduleHabitsSave();
}

//Show toast notifications
function showToast(message, type = "info") {
    if (!appState.ui.notifications) return;
    if (notifiToast.children.length >= 3) {
        notifiToast.firstElementChild.remove();
    }
    const toastHeading = {
        info: "ℹ️ Info",
        success: "✅ Success",
        error: "❗ Error",
        attention: "⚠️ Attention"
    };
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);
    const toastHead = document.createElement("h4");
    toastHead.textContent = toastHeading[type] || toastHeading.info;
    const toastText = document.createElement("p");
    toastText.textContent = message;
    toast.append(toastHead, toastText);
    if (type === "attention") {
        const undoBtn = document.createElement("button");
        undoBtn.textContent = "Undo";
        toast.append(undoBtn);
        undoBtn.onclick = function () {
            if (!deletedHabit) return;
            appState.habits.set(deletedHabit.id, deletedHabit);
            appState.habitNames.add(deletedHabit.cleanName);
            renderHabits();
            scheduleHabitsSave();
            deletedHabit = null;
        }
    }
    notifiToast.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });
    setTimeout(() => {
        toast.classList.remove("show");
        toast.addEventListener(
            "transitionend",
            () => toast.remove(),
            { once: true }
        );
    }, 4000);
}

function scheduleHabitsSave() {
    clearTimeout(habitsSaveTimer);
    habitsSaveTimer = setTimeout(() => {
        void saveHabitsState();
    }, 200);
}

function scheduleMetaSave() {
    clearTimeout(metaSaveTimer);
    metaSaveTimer = setTimeout(() => {
        void saveMetaState();
    }, 250);
}

//Save state to DB
async function saveHabitsState() {
    try {
        const habits = Array.from(appState.habits.values());
        await dbPutHabitsBulk(habits);
    } catch (error) {
        console.error('Error saving habits:', error);
        showToast('Failed to save habits. Please try again.', 'error');
    }
}

async function saveMetaState() {
    try {
        await dbSetAllMeta({
            filters: appState.filters,
            lastActiveDate: appState.lastActiveDate,
            ui: appState.ui
        });
    } catch (error) {
        console.error('Error saving metadata:', error);
    }
}

// Initialize App and Load State from DB
async function initApp() {
    try {
        // 1) Load habits
        const habits = await dbGetAllHabits();
        appState.habits = new Map(habits.map(habit => [habit.id, habit]));
        // 2) Rebuild habitNames
        appState.habitNames = new Set(habits.map(habit => habit.cleanName));
        // 3) Load settings
        const meta = await dbGetAllMeta(["filters", "lastActiveDate", "ui"]);
        appState.filters = meta.filters || appState.filters;
        appState.lastActiveDate = meta.lastActiveDate || null;
        appState.ui = meta.ui || appState.ui;
        // 4) Habits progress reset
        resetProgressIfNewPeriod();
        // 5) Update UI
        applyNotifications();
        applyTheme();
        if (searchInput) searchInput.value = appState.filters.q || "";
        updateActiveFilter();
        // 6) Render habits
        renderHabits();
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Failed to load app data. Please refresh the page.', 'error');
    }
}

initApp();

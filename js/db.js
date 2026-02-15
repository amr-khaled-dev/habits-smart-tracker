import { openDB } from "./libs/idb.js";

const DB_NAME = "smart-tracker-db";
const DB_VERSION = 1;

// Database: habits + meta (settings etc.)
export const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        // 1) habits store
        if (!db.objectStoreNames.contains("habits")) {
            const habitsStore = db.createObjectStore("habits", { keyPath: "id" });
            habitsStore.createIndex("order", "order");
            habitsStore.createIndex("status", "status");
            habitsStore.createIndex("cleanName", "cleanName", { unique: true });
        }

        // 2) meta store (settings, lastActiveDate, currentFilter...etc)
        if (!db.objectStoreNames.contains("meta")) {
            db.createObjectStore("meta", { keyPath: "key" });
        }
    }
});

// Habits Store
export async function dbGetAllHabits() {
    const db = await dbPromise;
    return db.getAll("habits");
}

export async function dbPutHabit(habit) {
    const db = await dbPromise;
    return db.put("habits", habit);
}

export async function dbPutHabitsBulk(habits) {
    const db = await dbPromise;
    const tx = db.transaction("habits", "readwrite");
    habits.forEach((habit) => tx.store.put(habit));
    await tx.done;
}

export async function dbDeleteHabit(id) {
    const db = await dbPromise;
    return db.delete("habits", id);
}

export async function dbClearHabits() {
    const db = await dbPromise;
    return db.clear("habits");
}

// Meta Store
export async function dbSetAllMeta(obj) {
    const db = await dbPromise;
    const tx = db.transaction("meta", "readwrite");
    await Promise.all(Object.entries(obj).map(([key, value]) => tx.store.put({ key, value })));
    await tx.done;
}

export async function dbGetAllMeta(keys) {
    const db = await dbPromise;
    const results = {};
    await Promise.all(keys.map(async (key) => {
        const row = await db.get("meta", key);
        results[key] = row?.value;
    }));
    return results;
}
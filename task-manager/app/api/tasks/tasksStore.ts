import type { Task } from "@/app/types";

/**
 * Shared in-memory data store for tasks attached to globalThis.
 * In Next.js App Router, Route Handlers in separate files access this global store
 * so all CRUD operations share the same task list in memory.
 */
declare global {
  // eslint-disable-next-line no-var
  var __tasksStore: Task[] | undefined;
}

if (!globalThis.__tasksStore) {
  globalThis.__tasksStore = [
    {
      id: 1,
      title: "Learn Next.js API Routes",
      completed: false,
      dueDate: "2026-09-10",
      priority: "high",
    },
    {
      id: 2,
      title: "Connect React Frontend to API",
      completed: true,
      dueDate: "2026-09-08",
      priority: "medium",
    },
  ];
}

/** Returns all current tasks */
export function getTasks(): Task[] {
  return globalThis.__tasksStore!;
}

/** Adds a new task */
export function addTask(newTask: Task): Task {
  globalThis.__tasksStore!.push(newTask);
  return newTask;
}

/** Updates a task by ID */
export function updateTask(id: number, updatedFields: Partial<Task>): Task | null {
  const tasks = globalThis.__tasksStore!;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...updatedFields };
  return tasks[index];
}

/** Deletes a task by ID */
export function deleteTask(id: number): boolean {
  const tasks = globalThis.__tasksStore!;
  const initialLength = tasks.length;
  globalThis.__tasksStore = tasks.filter((t) => t.id !== id);
  return globalThis.__tasksStore.length < initialLength;
}

/** Removes all completed tasks */
export function clearCompletedTasks(): void {
  globalThis.__tasksStore = globalThis.__tasksStore!.filter((t) => !t.completed);
}

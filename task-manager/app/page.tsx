'use client' 
import { useEffect, useState } from "react";
import type { Task, Priority } from "./types";
import TaskItem from './components/TaskItem';
import TaskForm from "./components/TaskForm";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Loading and error states for Async UI
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [pendingTaskIds, setPendingTaskIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeTaskCount = tasks.filter((task) => !task.completed).length;

  // Helper to add a task ID to pending set
  const addPendingId = (id: number) => setPendingTaskIds((prev) => [...prev, id]);
  const removePendingId = (id: number) => setPendingTaskIds((prev) => prev.filter((item) => item !== id));

  // 1. Fetch initial task list from API (GET /api/tasks)
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err: unknown) {
      console.error("Error fetching tasks from API:", err);
      setError("Unable to load tasks from server. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Clear completed tasks via API (DELETE /api/tasks?action=clearCompleted)
  const clearCompleted = async () => {
    setIsClearing(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks?action=clearCompleted", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to clear tasks (HTTP ${response.status})`);
      }
      const data = await response.json();
      setTasks(data.tasks);
    } catch (err: unknown) {
      console.error("Error clearing completed tasks:", err);
      setError("Failed to clear completed tasks. Please try again.");
    } finally {
      setIsClearing(false);
    }
  };

  // 3. Add a new task via API (POST /api/tasks)
  const addTask = async (title: string, dueDate?: string, priority?: Priority) => {
    if (title.trim() === '') return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dueDate, priority }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create task");
      }
      const newTask: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err: unknown) {
      console.error("Error adding task via API:", err);
      setError(err instanceof Error ? err.message : "Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Toggle completed status via API (PUT /api/tasks/[id])
  const toggleTask = async (id: number) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    addPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !targetTask.completed }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update task (HTTP ${response.status})`);
      }
      const updatedTask: Task = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err: unknown) {
      console.error("Error toggling task via API:", err);
      setError("Failed to update task completion status.");
    } finally {
      removePendingId(id);
    }
  };

  // 5. Delete a task by ID via API (DELETE /api/tasks/[id])
  const deleteTask = async (id: number) => {
    addPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task (HTTP ${response.status})`);
      }
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting task via API:", err);
      setError("Failed to delete task.");
    } finally {
      removePendingId(id);
    }
  };

  // 6. Edit task details via API (PUT /api/tasks/[id])
  const editTask = async (
    id: number,
    newTitle: string,
    dueDate?: string,
    priority?: Priority
  ) => {
    addPendingId(id);
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, dueDate, priority }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit task (HTTP ${response.status})`);
      }
      const updatedTask: Task = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id ? updatedTask : t))
      );
    } catch (err: unknown) {
      console.error("Error editing task via API:", error);
      setError("Failed to save edited task.");
    } finally {
      removePendingId(id);
    }
  };

  // Filter tasks based on selected status filter AND search query
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim());

    if (!matchesSearch) return false;

    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <main className="max-w-xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Task Manager
      </h1>

      {/* Task Form Component with isSubmitting state */}
      <TaskForm onAddTask={addTask} isSubmitting={isSubmitting} />

      {/* Error Banner UI */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Error:</span>
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTasks}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded font-medium transition"
            >
              Retry
            </button>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-500 hover:text-red-700 font-bold ml-1"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search Bar Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`border px-3 py-1 rounded transition-colors ${filter === 'all' ? 'bg-blue-600 text-white border-blue-600 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`border px-3 py-1 rounded transition-colors ${filter === 'active' ? 'bg-blue-600 text-white border-blue-600 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={`border px-3 py-1 rounded transition-colors ${filter === 'completed' ? 'bg-blue-600 text-white border-blue-600 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-600">{activeTaskCount} tasks remaining</p>
        <button
          className="border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3 py-1 rounded text-sm transition disabled:opacity-50 flex items-center gap-1.5"
          onClick={clearCompleted}
          disabled={isClearing || tasks.filter((t) => t.completed).length === 0}
        >
          {isClearing ? (
            <>
              <span className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
              Clearing...
            </>
          ) : (
            "Clear Completed"
          )}
        </button>
      </div>

      {/* Main Task List / Skeleton Loading */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between border-b pb-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
          </div>
          <div className="flex items-center justify-between border-b pb-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
          </div>
        </div>
      ) : (
        <ul>
          {filteredTasks.length === 0 ? (
            <li className="text-center py-6 text-gray-400">No tasks found.</li>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onToggle={toggleTask}
                onEdit={editTask}
                isPending={pendingTaskIds.includes(task.id)}
              />
            ))
          )}
        </ul>
      )}
    </main>
  );
}
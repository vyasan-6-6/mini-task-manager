'use client' 
import { useEffect, useState } from "react";
import type { Task, Priority } from "./types";
import TaskItem from './components/TaskItem';
import TaskForm from "./components/TaskForm";

export default function Home() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const activeTaskCount = tasks.filter((task) => !task.completed).length;
  const [filter,setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  // Step 5a: Clear completed tasks via API (DELETE /api/tasks?action=clearCompleted)
  const clearCompleted = async () => {
    try {
      const response = await fetch("/api/tasks?action=clearCompleted", {
        method: "DELETE",
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
    }
  };

  // Step 3: Fetch initial task list from our Next.js API route (GET /api/tasks)
  useEffect(() => {
    async function loadTasksFromApi() {
      try {
        const response = await fetch("/api/tasks"); // Calls GET /api/tasks on server
        const data: Task[] = await response.json(); // Converts JSON response to Task[]
        setTasks(data); // Updates React state with server tasks
      } catch (error) {
        console.error("Error fetching tasks from API:", error);
      }
    }

    loadTasksFromApi();
  }, []);


  // Step 4: Add a new task by calling POST /api/tasks
  const addTask = async (title: string, dueDate?: string, priority?: Priority) => {
    if (title.trim() === '') return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST", // HTTP method POST sends new data to the server
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dueDate, priority }), // Payload sent as JSON
      });

      if (!response.ok) throw new Error("Failed to create task");
      const newTask: Task = await response.json(); // Server returns the created task

      setTasks((prevTasks) => [...prevTasks, newTask]); // Add created task to state
    } catch (error) {
      console.error("Error adding task via API:", error);
    }
  };

  // Step 5b: Toggle completed status via API (PUT /api/tasks/[id])
  const toggleTask = async (id: number) => {
    const targetTask = tasks.find((t) => t.id === id);
    if (!targetTask) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !targetTask.completed }),
      });

      if (response.ok) {
        const updatedTask: Task = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === id ? updatedTask : t))
        );
      }
    } catch (error) {
      console.error("Error toggling task via API:", error);
    }
  };

  // Step 5c: Delete a task by ID via API (DELETE /api/tasks/[id])
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task via API:", error);
    }
  };

  // Step 5d: Edit task details via API (PUT /api/tasks/[id])
  const editTask = async (
    id: number,
    newTitle: string,
    dueDate?: string,
    priority?: Priority
  ) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, dueDate, priority }),
      });

      if (response.ok) {
        const updatedTask: Task = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === id ? updatedTask : t))
        );
      }
    } catch (error) {
      console.error("Error editing task via API:", error);
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
       <TaskForm onAddTask={addTask}/>

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

      <div className="flex gap-2 mb-4">
  <button
    className="border px-3 py-1 rounded"
    onClick={() => setFilter("all")}
  >
    All
  </button>

  <button
    className="border px-3 py-1 rounded"
    onClick={() => setFilter("active")}
  >
    Active
  </button>

  <button
    className="border px-3 py-1 rounded"
    onClick={() => setFilter("completed")}
  >
    Completed
  </button>
</div>
<p>{activeTaskCount} tasks remaining</p>
<button
  className="border px-3 py-1 rounded mb-4"
  onClick={clearCompleted}
>
  Clear Completed
</button>
      <ul>
  {filteredTasks.map((task) => (
    <TaskItem
      key={task.id}
      task={task}
      onDelete={deleteTask}
      onToggle={toggleTask}
      onEdit={editTask}
    />
  ))}
</ul>
    </main>
  );
}
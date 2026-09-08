'use client' 
import { useEffect, useState } from "react";
import type { Task } from "./types";
import TaskItem from './components/TaskItem';
import TaskForm from "./components/TaskForm";

export default function Home() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const activeTaskCount = tasks.filter((task) => !task.completed).length;
  const [filter,setFilter] = useState<'all' | 'completed' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

   const clearCompleted = () => {
  setTasks((previousTasks) =>
    previousTasks.filter((task) => !task.completed)
  );
};
  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    setIsLoaded(true);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const addTask = (title:string)=>{
    if(title.trim()==='') return;

    const newTask:Task = {
      id:Date.now(),
      title:title,
      completed:false
    }
    setTasks([...tasks,newTask]);
  }
    const toggleTask = (id: number) => {
  setTasks(
    tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )
  );
};

const deleteTask = (id:number)=>{
setTasks(tasks.filter((task)=>task.id !== id));
}

  // Update a task's title by matching its id
  const editTask = (id: number, newTitle: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
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
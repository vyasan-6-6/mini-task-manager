'use client' 
import { useState } from "react";
import type { Task } from "./types";

export default function Home() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const [title,setTitle] = useState('')

  const addTask = ()=>{
    if(title.trim()==='') return;

    const newTask:Task = {
      id:Date.now(),
      title:title,
      completed:false
    }
    setTasks([...tasks,newTask]);
    setTitle("");
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
  
  return (
    <main>
      <h1>Task Manager</h1>
      <input type="text"  placeholder="add a task" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <button onClick={addTask}>add</button>

      <ul>
  {tasks.map((task) => (
   <li key={task.id}>
 <span
  style={{
    textDecoration: task.completed ? "line-through" : "none",
  }}
>
  {task.title}
</span>
 <button onClick={() => toggleTask(task.id)}>
    {task.completed ? " Undo" : " Complete"}
  </button>
</li>
  ))}
</ul>
    </main>
  );
}
'use client' 
import { useState } from "react";
import type { Task } from "./types";
import TaskItem from './components/TaskItem';

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

const deleteTask = (id:number)=>{
setTasks(tasks.filter((task)=>task.id !== id));
}
  
  return (
    <main>
      <h1>Task Manager</h1>
      <input type="text"  placeholder="add a task" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <button onClick={addTask}>add</button>

      <ul>
  {tasks.map((task) => (
    <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggle={toggleTask}/>
  ))}
</ul>
    </main>
  );
}
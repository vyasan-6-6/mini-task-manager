'use client' 
import { useState } from "react";
import type { Task } from "./types";
import TaskItem from './components/TaskItem';
import TaskForm from "./components/TaskForm";

export default function Home() {
  const [tasks,setTasks] = useState<Task[]>([]);

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
  
  return (
    <main>
      <h1>Task Manager</h1>
       <TaskForm onAddTask={addTask}/>
      <ul>
  {tasks.map((task) => (
    <TaskItem key={task.id} task={task} onDelete={deleteTask} onToggle={toggleTask}/>
  ))}
</ul>
    </main>
  );
}
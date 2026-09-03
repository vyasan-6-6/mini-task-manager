'use client';

import { useState } from "react";

type TaskFormProps = {
    onAddTask:(title:string)=>void;
}
export default function TaskForm ({onAddTask}:TaskFormProps){
const [title,setTitle]  = useState('');
const handleSubmit = ()=>{
    if(title.trim()==='') return ;
    onAddTask(title);
   setTitle('');
}
return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a task"
      />

      <button onClick={handleSubmit}>Add</button>
    </div>
)
}
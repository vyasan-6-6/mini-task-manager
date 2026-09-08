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
    <div className="flex gap-2 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a task"
        className="flex-1 border   rounded-lg px-3 py-2"
      />

      <button onClick={handleSubmit}     className="bg-black text-white px-4 py-2 rounded-lg"
>Add</button>
    </div>
)
}
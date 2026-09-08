'use client';

import { useState } from "react";
import type { Priority } from "../types";

type TaskFormProps = {
  onAddTask: (title: string, dueDate?: string, priority?: Priority) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (title.trim() === "") return;
    onAddTask(title.trim(), dueDate || undefined, priority);
    setTitle("");
    setDueDate("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border dark:border-gray-800">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full border dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
      
      <div className="flex gap-2 items-center mt-1">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="border dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
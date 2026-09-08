import { useState } from "react";
import type { Task, Priority } from "../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string, dueDate?: string, priority?: Priority) => void;
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");
  const [editedPriority, setEditedPriority] = useState<Priority>(task.priority || "medium");

  const handleSave = () => {
    if (editedTitle.trim() === "") return;
    onEdit(task.id, editedTitle.trim(), editedDueDate || undefined, editedPriority);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDueDate(task.dueDate || "");
    setEditedPriority(task.priority || "medium");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between border-b py-3 gap-3">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 w-full">
          <input
            type="text"
            className="border px-2 py-1 rounded flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="border px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as Priority)}
              onKeyDown={handleKeyDown}
              className="border px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              className="bg-blue-600 text-white px-2.5 py-1 rounded text-sm hover:bg-blue-700"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="border px-2.5 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1 flex-1">
            <span className={task.completed ? "line-through text-gray-400" : "font-medium"}>
              {task.title}
            </span>
            <div className="flex items-center gap-2 text-xs">
              {task.priority && (
                <span className={`px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              )}
              {task.dueDate && (
                <span className="text-gray-500 dark:text-gray-400">
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center shrink-0">
            <button
              className="border px-2 py-1 rounded ml-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              className="border px-2 py-1 rounded ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              onClick={() => onToggle(task.id)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button
              className="border px-2 py-1 rounded ml-2 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-sm"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
}
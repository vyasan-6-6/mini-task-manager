import { useState } from "react";
import type { Task } from "../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newTitle: string) => void;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onEdit,
}: TaskItemProps) {
  // Local state to track whether this item is currently being edited
  const [isEditing, setIsEditing] = useState(false);
  // Local state to hold the temporary text while editing
  const [editedTitle, setEditedTitle] = useState(task.title);

  // Save the new title and exit edit mode
  const handleSave = () => {
    if (editedTitle.trim() === "") return;
    onEdit(task.id, editedTitle.trim());
    setIsEditing(false);
  };

  // Cancel editing and revert to the original title
  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  // Allow pressing "Enter" to save and "Escape" to cancel
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <li className="flex items-center justify-between border-b py-3">
      {isEditing ? (
        // --- EDIT MODE ---
        <div className="flex items-center gap-2 flex-1 mr-2">
          <input
            type="text"
            className="border px-2 py-1 rounded flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="bg-blue-600 text-white px-2.5 py-1 rounded text-sm hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="border px-2.5 py-1 rounded text-sm hover:bg-gray-100"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        // --- DISPLAY MODE ---
        <>
          <span
            className={task.completed ? "line-through text-gray-400" : ""}
          >
            {task.title}
          </span>

          <div className="flex items-center">
            {/* Edit Button */}
            <button
              className="border px-2 py-1 rounded ml-3 hover:bg-gray-100"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            {/* Toggle Complete Button */}
            <button
              className="border px-2 py-1 rounded ml-2 hover:bg-gray-100"
              onClick={() => onToggle(task.id)}
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            {/* Delete Button */}
            <button
              className="border px-2 py-1 rounded ml-2 text-red-600 border-red-200 hover:bg-red-50"
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
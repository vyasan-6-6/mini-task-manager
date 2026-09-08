import type { Task } from "../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li className="flex items-center justify-between border-b py-3">
      <span
        className={task.completed ? "line-through text-gray-400" : ""}
      >
        {task.title}
      </span>

      <div>
        <button
          className="border px-2 py-1 rounded ml-3"
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? "Undo" : "Complete"}
        </button>

        <button
          className="border px-2 py-1 rounded ml-2"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
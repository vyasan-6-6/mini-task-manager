import type {Task} from '../types';

type TaskItemProps = {
    task:Task;
    onToggle:(id:number)=>void;
    onDelete:(id:number)=>void;
}

export default function TaskItem({task,onToggle,onDelete}:TaskItemProps){
return (
    <li>
      <span
        style={{
          textDecoration: task.completed ? "line-through" : "none",
        }}
      >
        {task.title}
      </span>

      <button onClick={() => onToggle(task.id)}>
        {task.completed ? "Undo" : "Complete"}
      </button>

      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
)
}
export type Priority = "low" | "medium" | "high";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: Priority;
};
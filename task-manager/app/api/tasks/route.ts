import { NextResponse } from "next/server";
import type { Task } from "@/app/types";

// Sample list of tasks stored on the server
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn Next.js API Routes",
    completed: false,
    dueDate: "2026-09-10",
    priority: "high",
  },
  {
    id: 2,
    title: "Connect React Frontend to API",
    completed: true,
    dueDate: "2026-09-08",
    priority: "medium",
  },
];

/**
 * Step 2: GET /api/tasks
 * 
 * When the frontend makes a request to `GET /api/tasks`,
 * this handler runs on the server and returns the array of tasks as JSON.
 */
export async function GET() {
  return NextResponse.json(initialTasks);
}

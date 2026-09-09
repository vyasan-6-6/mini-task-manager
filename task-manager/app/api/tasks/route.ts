import { NextResponse } from "next/server";
import type { Task, Priority } from "@/app/types";

// In-memory list of tasks stored on the server
const tasks: Task[] = [
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
 * Returns the list of tasks from the server.
 */
export async function GET() {
  return NextResponse.json(tasks);
}

/**
 * Step 4: POST /api/tasks
 * Receives JSON body from the client ({ title, dueDate, priority })
 * and creates a new task on the server.
 */
export async function POST(request: Request) {
  try {
    // 1. Read JSON sent by client in request body
    const body = await request.json();
    const { title, dueDate, priority } = body as {
      title?: string;
      dueDate?: string;
      priority?: Priority;
    };

    // Validation: check if title exists
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 } // Bad Request
      );
    }

    // 2. Create new Task object
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      completed: false,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
    };

    // 3. Add to server array
    tasks.push(newTask);

    // 4. Return created task with 201 Created HTTP status
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}


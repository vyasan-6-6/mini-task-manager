import { NextResponse } from "next/server";
import { getTasks, addTask, clearCompletedTasks } from "./tasksStore";
import type { Priority } from "@/app/types";

/**
 * GET /api/tasks
 * Returns the list of tasks from the server store.
 */
export async function GET() {
  return NextResponse.json(getTasks());
}

/**
 * POST /api/tasks
 * Receives JSON body from the client ({ title, dueDate, priority })
 * and creates a new task on the server.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, dueDate, priority } = body as {
      title?: string;
      dueDate?: string;
      priority?: Priority;
    };

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const newTask = addTask({
      id: Date.now(),
      title: title.trim(),
      completed: false,
      dueDate: dueDate || undefined,
      priority: priority || undefined,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/tasks?action=clearCompleted
 * Clears all completed tasks from the server.
 */
export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "clearCompleted") {
    clearCompletedTasks();
    return NextResponse.json({
      message: "Completed tasks cleared",
      tasks: getTasks(),
    });
  }

  return NextResponse.json(
    { error: "Invalid action. Use ?action=clearCompleted" },
    { status: 400 }
  );
}



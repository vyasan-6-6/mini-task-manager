import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "../tasksStore";
import type { Priority } from "@/app/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * Step 5: Dynamic API Route Handler (`/api/tasks/[id]`)
 * 
 * PUT /api/tasks/[id]
 * Updates properties of a task matching the given ID.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id: idStr } = await params;
    const id = Number(idStr);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, completed, dueDate, priority } = body as {
      title?: string;
      completed?: boolean;
      dueDate?: string;
      priority?: Priority;
    };

    const updatedTask = updateTask(id, {
      ...(title !== undefined && { title }),
      ...(completed !== undefined && { completed }),
      ...(dueDate !== undefined && { dueDate }),
      ...(priority !== undefined && { priority }),
    });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request payload" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/tasks/[id]
 * Removes a task matching the given ID from the server store.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id: idStr } = await params;
  const id = Number(idStr);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
  }

  const success = deleteTask(id);

  if (!success) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Task with ID ${id} deleted successfully`,
  });
}

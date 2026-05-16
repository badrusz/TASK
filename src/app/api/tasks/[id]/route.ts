import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const body = await request.json();
    
    const task = await Task.findByIdAndUpdate(id, {
      ...body,
      completedAt: body.status === 'completed' ? new Date() : undefined
    }, { new: true });
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

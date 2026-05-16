import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function GET() {
  try {
    await connectDB();
    
    // 1. Activity Data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE'),
        count: 0
      };
    }).reverse();

    const completedTasks = await Task.find({
      status: 'completed',
      completedAt: { $gte: subDays(new Date(), 7) }
    });

    completedTasks.forEach(task => {
      const day = format(task.completedAt!, 'yyyy-MM-dd');
      const dayData = last7Days.find(d => d.date === day);
      if (dayData) dayData.count++;
    });

    // 2. Busy-ness Analysis (Task density)
    const pendingTasks = await Task.find({ status: { $ne: 'completed' } });
    const busyScore = Math.min(100, (pendingTasks.length / 10) * 100);
    
    // 3. AI Suggestions (Heuristic)
    // Suggest high priority tasks with closest deadlines
    const suggestions = await Task.find({ status: 'todo' })
      .sort({ priority: -1, deadline: 1 })
      .limit(3);

    return NextResponse.json({
      activity: last7Days,
      busyScore,
      suggestions,
      totalPending: pendingTasks.length,
      totalCompleted: completedTasks.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import * as jsonDb from '@/lib/jsonDb';
import { subDays, format, isAfter, startOfDay } from 'date-fns';

export async function GET() {
  try {
    const tasks = await jsonDb.getTasks();
    
    // 1. Activity Data (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE'),
        count: 0
      };
    }).reverse();

    const sevenDaysAgo = subDays(new Date(), 7);
    const completedTasks = tasks.filter(task => 
      task.status === 'completed' && 
      task.completedAt && 
      isAfter(new Date(task.completedAt), sevenDaysAgo)
    );

    completedTasks.forEach(task => {
      const day = format(new Date(task.completedAt!), 'yyyy-MM-dd');
      const dayData = last7Days.find(d => d.date === day);
      if (dayData) dayData.count++;
    });

    // 2. Busy-ness Analysis (Task density)
    const pendingTasks = tasks.filter(task => task.status !== 'completed');
    const busyScore = Math.min(100, (pendingTasks.length / 10) * 100);
    
    // 3. AI Suggestions (Heuristic)
    // Suggest high priority tasks with closest deadlines
    const suggestions = tasks
      .filter(task => task.status === 'todo')
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const pA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
        const pB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
        
        if (pA !== pB) return pB - pA;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      })
      .slice(0, 3);

    return NextResponse.json({
      activity: last7Days,
      busyScore,
      suggestions,
      totalPending: pendingTasks.length,
      totalCompleted: tasks.filter(t => t.status === 'completed').length
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}

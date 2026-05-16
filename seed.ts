import connectDB from './src/lib/db';
import Task from './src/models/Task';
import { subDays } from 'date-fns';

async function seed() {
  await connectDB();
  
  // Clear existing
  await Task.deleteMany({});

  const tasks = [
    {
      title: 'Design Premium UI',
      category: 'Design',
      status: 'completed',
      priority: 'high',
      deadline: new Date(),
      duration: 3600,
      completedAt: subDays(new Date(), 1)
    },
    {
      title: 'Setup MongoDB',
      category: 'Backend',
      status: 'completed',
      priority: 'high',
      deadline: new Date(),
      duration: 1800,
      completedAt: subDays(new Date(), 2)
    },
    {
      title: 'Implement Timer Logic',
      category: 'Frontend',
      status: 'todo',
      priority: 'medium',
      deadline: new Date(Date.now() + 86400000),
      duration: 0
    },
    {
      title: 'Activity Chart Integration',
      category: 'Frontend',
      status: 'in-progress',
      priority: 'high',
      deadline: new Date(Date.now() + 172800000),
      duration: 0
    }
  ];

  await Task.insertMany(tasks);
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();

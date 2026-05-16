import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

export interface TaskData {
  _id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  deadline: string;
  createdAt: string;
  completedAt?: string;
}

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(TASKS_FILE);
    } catch {
      await fs.writeFile(TASKS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Failed to ensure data directory:', error);
  }
}

export async function getTasks(): Promise<TaskData[]> {
  await ensureDataDir();
  const data = await fs.readFile(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
}

export async function saveTask(task: Omit<TaskData, '_id' | 'createdAt'>): Promise<TaskData> {
  const tasks = await getTasks();
  const newTask: TaskData = {
    ...task,
    _id: Math.random().toString(36).substring(2, 11),
    createdAt: new Date().toISOString(),
    status: task.status || 'todo'
  };
  tasks.push(newTask);
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
  return newTask;
}

export async function updateTask(id: string, updates: Partial<TaskData>): Promise<TaskData | null> {
  const tasks = await getTasks();
  const index = tasks.findIndex(t => t._id === id);
  if (index === -1) return null;

  if (updates.status === 'completed' && tasks[index].status !== 'completed') {
    updates.completedAt = new Date().toISOString();
  }

  tasks[index] = { ...tasks[index], ...updates };
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
  return tasks[index];
}

export async function deleteTask(id: string): Promise<boolean> {
  const tasks = await getTasks();
  const filtered = tasks.filter(t => t._id !== id);
  if (filtered.length === tasks.length) return false;
  await fs.writeFile(TASKS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

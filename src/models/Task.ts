import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  category: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  duration: number; // in seconds
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['todo', 'in-progress', 'completed'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: { type: Date },
  duration: { type: Number, default: 0 },
  completedAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

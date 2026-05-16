'use client';
import React, { useState } from 'react';
import styles from './TaskForm.module.css';

interface TaskFormProps {
  onClose: () => void;
  onRefresh: () => void;
  task?: any;
}

const TaskForm = ({ onClose, onRefresh, task }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'General',
    priority: task?.priority || 'medium',
    deadline: task?.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = task ? `/api/tasks/${task._id}` : '/api/tasks';
      const method = task ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        }),
      });
      if (res.ok) {
        onRefresh();
        onClose();
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} glass`}>
        <h2>{task ? 'Edit Tugas' : 'Buat Tugas Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Judul Tugas</label>
            <input 
              type="text" 
              required 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Apa yang ingin dikerjakan?"
            />
          </div>
          <div className={styles.field}>
            <label>Kategori</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Health">Health</option>
              <option value="Study">Study</option>
            </select>
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Prioritas</label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Deadline</label>
              <input 
                type="date" 
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
              />
            </div>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Batal</button>
            <button type="submit" className="premium-btn">Simpan Tugas</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

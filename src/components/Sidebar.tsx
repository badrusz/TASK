'use client';
import React from 'react';
import { LayoutDashboard, CheckSquare, Clock, BarChart3, Settings, PlusCircle } from 'lucide-react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onAddTask: () => void;
  activeView: 'dashboard' | 'tasks';
  onViewChange: (view: 'dashboard' | 'tasks') => void;
}

const Sidebar = ({ onAddTask, activeView, onViewChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'tasks', icon: <CheckSquare size={20} />, label: 'Tasks' },
    { id: 'timer', icon: <Clock size={20} />, label: 'Timer' },
    { id: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.logo}>
        <h2 className="gradient-text">TaskFlow</h2>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            className={`${styles.navItem} ${activeView === item.id ? styles.active : ''}`}
            onClick={() => (item.id === 'dashboard' || item.id === 'tasks') && onViewChange(item.id as any)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <button 
          onClick={onAddTask}
          className="premium-btn" 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <PlusCircle size={18} />
          <span>New Task</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

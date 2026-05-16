'use client';
import React from 'react';
import { LayoutDashboard, CheckSquare, Clock, BarChart3, Settings, PlusCircle, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onAddTask: () => void;
  activeView: 'dashboard' | 'tasks' | 'timer' | 'analytics' | 'settings';
  onViewChange: (view: 'dashboard' | 'tasks' | 'timer' | 'analytics' | 'settings') => void;
}

const Sidebar = ({ onAddTask, activeView, onViewChange }: SidebarProps) => {
  const { data: session } = useSession();
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
            onClick={() => onViewChange(item.id as any)}
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
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}
        >
          <PlusCircle size={18} />
          <span>New Task</span>
        </button>

        {session?.user && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {session.user.name || 'User'}
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {session.user.email}
              </p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
              className="hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

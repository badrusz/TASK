'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ActivityChart from '@/components/ActivityChart';
import Timer from '@/components/Timer';
import { Search, Bell, Calendar, Flame, Zap, ArrowRight, CheckSquare, PlusCircle } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks' | 'timer' | 'analytics' | 'settings'>('dashboard');
  const [settings, setSettings] = useState({
    username: 'User',
    darkMode: true,
    notifications: true
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('taskflow_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('taskflow_settings', JSON.stringify(updated));
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/analysis');
      const d = await res.json();
      setData(d);
      
      if (activeView === 'tasks') {
        const tasksRes = await fetch('/api/tasks');
        const tasksData = await tasksRes.json();
        setAllTasks(tasksData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeView]);

  const handleCompleteTask = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      fetchData();
    } catch (error) {
      console.error('Failed to complete task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  const totalTasks = (data?.totalPending || 0) + (data?.totalCompleted || 0);
  const successRate = totalTasks > 0 ? Math.round((data.totalCompleted / totalTasks) * 100) : 0;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            <section className={styles.welcome}>
              <h1>Selamat Pagi, <span className="gradient-text">{settings.username}!</span></h1>
              <p>Anda memiliki {data?.totalPending || 0} tugas yang harus diselesaikan hari ini.</p>
            </section>

            <div className={styles.grid}>
              {/* Main Analytics */}
              <div className={`${styles.chartCard} glass`}>
                <div className={styles.cardHeader}>
                  <h3>Grafik Aktivitas</h3>
                  <Calendar size={18} />
                </div>
                <ActivityChart data={data?.activity || []} />
              </div>

              {/* Busy-ness Analysis */}
              <div className={`${styles.statsCard} glass`}>
                <div className={styles.cardHeader}>
                  <h3>Analisa Kesibukan</h3>
                  <Flame size={18} color="#ef4444" />
                </div>
                <div className={styles.busyDisplay}>
                  <div className={styles.busyCircle} style={{ borderColor: data?.busyScore > 70 ? 'var(--error)' : 'var(--primary)' }}>
                    <span className={styles.busyValue}>{Math.round(data?.busyScore || 0)}%</span>
                    <span className={styles.busyLabel}>Kapasitas</span>
                  </div>
                  <p className={styles.busyHint}>
                    {data?.busyScore > 70 ? 'Waspada burnout! Kurangi beban kerja.' : 'Beban kerja optimal. Tetap produktif!'}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div className={`${styles.suggestCard} glass`}>
                <div className={styles.cardHeader}>
                  <h3>Saran Prioritas</h3>
                  <Zap size={18} color="#f59e0b" />
                </div>
                <div className={styles.suggestList}>
                  {data?.suggestions?.length > 0 ? (
                    data.suggestions.map((task: any) => (
                      <div key={task._id} className={styles.suggestItem}>
                        <div onClick={() => handleEditTask(task)}>
                          <h4>{task.title}</h4>
                          <span>{task.category} • {new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                        <CheckSquare 
                          size={20} 
                          className={styles.completeIcon} 
                          onClick={() => handleCompleteTask(task._id)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyState}>Tidak ada saran saat ini.</p>
                  )}
                </div>
              </div>

              {/* Timer */}
              <div className={styles.timerWrapper}>
                <Timer />
              </div>

              {/* Success Indicator */}
              <div className={`${styles.successCard} glass`}>
                <div className={styles.cardHeader}>
                  <h3>Indikator Keberhasilan</h3>
                  <CheckSquare size={18} color="#10b981" />
                </div>
                <div className={styles.successContent}>
                  <div className={styles.successScore}>{successRate}%</div>
                  <p>Tugas Selesai</p>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${successRate}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'tasks':
        return (
          <section className={styles.tasksView}>
            <div className={styles.viewHeader}>
              <h2>Daftar Semua Tugas</h2>
              <div className={styles.viewActions}>
                <button className="premium-btn" onClick={() => { setEditingTask(null); setShowModal(true); }}>
                  <PlusCircle size={18} /> Tambah Tugas
                </button>
              </div>
            </div>
            <div className={styles.taskList}>
              {allTasks.length > 0 ? (
                allTasks.map((task: any) => (
                  <div key={task._id} className={`${styles.taskListItem} glass`}>
                    <div className={styles.taskMainInfo}>
                      <div className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                        {task.priority}
                      </div>
                      <div className={styles.taskText}>
                        <h4>{task.title}</h4>
                        <p>{task.category} • Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={styles.taskActions}>
                      {task.status !== 'completed' && (
                        <button onClick={() => handleCompleteTask(task._id)} className={styles.completeBtn}>
                          Selesai
                        </button>
                      )}
                      <button onClick={() => handleEditTask(task)} className={styles.editBtn}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTask(task._id)} className={styles.deleteBtn}>
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyTasks}>
                  <p>Belum ada tugas. Mulai harimu dengan membuat tugas baru!</p>
                </div>
              )}
            </div>
          </section>
        );

      case 'timer':
        return (
          <section className={styles.centeredView}>
            <h2>Focus Timer</h2>
            <p>Konsentrasi penuh pada tugasmu dengan teknik Pomodoro.</p>
            <div className={styles.largeTimer}>
              <Timer />
            </div>
          </section>
        );

      case 'analytics':
        return (
          <section className={styles.analyticsView}>
            <h2>Analytics & Insight</h2>
            <div className={styles.analyticsGrid}>
              <div className={`${styles.largeChart} glass`}>
                <h3>Tren Produktivitas Mingguan</h3>
                <ActivityChart data={data?.activity || []} />
              </div>
              <div className={`${styles.statsGrid}`}>
                <div className="glass p-6 rounded-2xl">
                  <h4 className="text-muted mb-2">Total Tugas</h4>
                  <div className="text-3xl font-bold">{totalTasks}</div>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <h4 className="text-muted mb-2">Selesai</h4>
                  <div className="text-3xl font-bold text-success">{data?.totalCompleted || 0}</div>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <h4 className="text-muted mb-2">Pending</h4>
                  <div className="text-3xl font-bold text-primary">{data?.totalPending || 0}</div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'settings':
        return (
          <section className={styles.settingsView}>
            <h2>Settings</h2>
            <div className={`${styles.settingsCard} glass`}>
              <div className={styles.settingsGroup}>
                <h3>Profil</h3>
                <div className={styles.settingItem}>
                  <label>Nama Pengguna</label>
                  <input 
                    type="text" 
                    value={settings.username} 
                    onChange={(e) => updateSettings({ username: e.target.value })}
                    className="glass" 
                  />
                </div>
              </div>
              <div className={styles.settingsGroup}>
                <h3>Aplikasi</h3>
                <div className={styles.settingItem}>
                  <span>Dark Mode</span>
                  <div 
                    className={settings.darkMode ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  >
                    {settings.darkMode ? 'On' : 'Off'}
                  </div>
                </div>
                <div className={styles.settingItem}>
                  <span>Notifikasi</span>
                  <div 
                    className={settings.notifications ? styles.toggleActive : styles.toggleInactive}
                    onClick={() => updateSettings({ notifications: !settings.notifications })}
                  >
                    {settings.notifications ? 'On' : 'Off'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="layout-container">
      <Sidebar 
        onAddTask={() => { setEditingTask(null); setShowModal(true); }} 
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main className="main-content">
        <header className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={18} color="#94a3b8" />
            <input type="text" placeholder="Search tasks..." />
          </div>
          <div className={styles.headerActions}>
            <Bell size={20} />
            <div className={styles.avatar}></div>
          </div>
        </header>

        {renderContent()}
      </main>

      {showModal && (
        <TaskForm 
          onClose={() => { setShowModal(false); setEditingTask(null); }} 
          onRefresh={fetchData}
          task={editingTask}
        />
      )}
    </div>
  );
}

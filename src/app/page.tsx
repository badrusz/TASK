'use client';
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ActivityChart from '@/components/ActivityChart';
import Timer from '@/components/Timer';
import { Search, Bell, Calendar, Flame, Zap, ArrowRight, CheckSquare } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeView, setActiveView] = useState<'dashboard' | 'tasks'>('dashboard');

  const fetchData = () => {
    fetch('/api/analysis')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  const totalTasks = (data?.totalPending || 0) + (data?.totalCompleted || 0);
  const successRate = totalTasks > 0 ? Math.round((data.totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="layout-container">
      <Sidebar 
        onAddTask={() => setShowModal(true)} 
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

        {activeView === 'dashboard' ? (
          <>
            <section className={styles.welcome}>
              <h1>Selamat Pagi, <span className="gradient-text">User!</span></h1>
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
                      <div key={task._id} className={styles.suggestItem} onClick={() => handleCompleteTask(task._id)}>
                        <div>
                          <h4>{task.title}</h4>
                          <span>{task.category} • Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                        <CheckSquare size={16} color="#10b981" />
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
        ) : (
          <section className={styles.tasksView}>
            <h2>Daftar Semua Tugas</h2>
            <div className={styles.taskList}>
              {/* This will be populated from a full tasks API in a real app, 
                  for now we'll use suggestions + pending from data */}
              {data?.suggestions?.map((task: any) => (
                <div key={task._id} className={`${styles.taskListItem} glass`}>
                  <div className={styles.taskInfo}>
                    <h4>{task.title}</h4>
                    <p>{task.category} • Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleCompleteTask(task._id)} className={styles.completeBtn}>
                    Selesaikan
                  </button>
                </div>
              ))}
              {data?.suggestions?.length === 0 && <p>Belum ada tugas. Klik "New Task" untuk menambah.</p>}
            </div>
          </section>
        )}
      </main>

      {showModal && (
        <TaskForm 
          onClose={() => setShowModal(false)} 
          onRefresh={fetchData} 
        />
      )}
    </div>
  );
}

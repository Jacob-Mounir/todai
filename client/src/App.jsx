import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import TaskBoard from './components/TaskBoard';

function App() {
  const [userContext, setUserContext] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Check emails', bucket: 'Today', importanceScore: 40, contextTags: ['Routine'], estimatedMinutes: 15, macroCategory: 'Communication' },
    { id: '2', title: 'Prepare Q3 roadmap', bucket: 'Future', importanceScore: 90, contextTags: ['Work', 'Strategy'], estimatedMinutes: 120, macroCategory: 'Deep Work' }
  ]);
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Fetch tasks on load
  React.useEffect(() => {
    fetch('http://localhost:3000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to fetch tasks', err));
  }, []);

  // Handlers
  const handleAddTask = async (title) => {
    try {
      const res = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleAutoOrganize = async () => {
    setIsOrganizing(true);

    // Simulate API delay for "thinking" effect
    await new Promise(r => setTimeout(r, 1200));

    try {
      // Try API first (only works if backend is running locally)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for static demo detection

      const res = await fetch('http://localhost:3000/api/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          currentTasks: tasks
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API failed');

      const organizedTasks = await res.json();
      setTasks(organizedTasks);
    } catch (err) {
      console.log('Backend unreachable (Demo Mode), using Client Impl');
      // Fallback to Client Logic
      const { organizeTasksLocally } = await import('./utils/smartSort');
      const organizedTasks = organizeTasksLocally(tasks, userContext);
      setTasks(organizedTasks);
    } finally {
      setIsOrganizing(false);
    }
  };

  return (
    <DashboardLayout
      userContext={userContext}
      setUserContext={setUserContext}
    >
      <TaskBoard
        tasks={tasks}
        onAddTask={handleAddTask}
        onAutoOrganize={handleAutoOrganize}
        isOrganizing={isOrganizing}
      />
    </DashboardLayout>
  );
}

export default App;

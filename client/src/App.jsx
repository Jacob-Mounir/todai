import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import UserContext from './components/UserContext';
import TaskBoard from './components/TaskBoard';
import ChatAssistant from './components/ChatAssistant';

function App() {
  const [userContext, setUserContext] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Check emails', bucket: 'Today', importanceScore: 40, contextTags: ['Routine'] },
    { id: '2', title: 'Prepare Q3 roadmap', bucket: 'Future', importanceScore: 90, contextTags: ['Work', 'Strategy'] }
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
    try {
      const res = await fetch('http://localhost:3000/api/organize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          currentTasks: tasks
        })
      });
      const organizedTasks = await res.json();
      setTasks(organizedTasks);
    } catch (err) {
      console.error('Failed to organize', err);
    } finally {
      setIsOrganizing(false);
    }
  };

  return (
    <DashboardLayout
      leftSidebar={<UserContext value={userContext} onChange={setUserContext} />}
      rightSidebar={<ChatAssistant />}
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

'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { taskService } from '@/services/taskService';
import { Task, TaskStatus } from '@/types';
import { Plus, LayoutList, LayoutGrid } from 'lucide-react';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskList from '@/components/tasks/TaskList';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      loadTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout title="Tasks">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading tasks...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'board' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('board')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setView('list')}
            >
              <LayoutList className="h-4 w-4 mr-2" />
              List
            </Button>
          </div>

          <Button size="md">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Content */}
        {view === 'board' ? (
          <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </div>
    </AppLayout>
  );
}

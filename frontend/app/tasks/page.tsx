'use client';

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { taskService, TaskFilters } from '@/services/taskService';
import { Task, TaskStatus, Priority } from '@/types';
import { Plus, LayoutList, LayoutGrid, Search, X } from 'lucide-react';
import TaskBoard from '@/components/tasks/TaskBoard';
import TaskList from '@/components/tasks/TaskList';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import { useAuth } from '@/hooks/useAuth';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const loadTasks = async (currentFilters?: TaskFilters) => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(currentFilters || filters);
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        setFilters(prev => ({ ...prev, search: searchTerm }));
        loadTasks({ ...filters, search: searchTerm });
      } else {
        const prevSearch = filters.search;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { search, ...rest } = filters;
        setFilters(rest);
        if (prevSearch) {
          loadTasks(rest);
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters, loadTasks]);

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

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleFilterChange = useCallback((key: keyof TaskFilters, value: string | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      loadTasks(newFilters);
      return newFilters;
    });
  }, [loadTasks]);

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    loadTasks({});
  };

  if (loading) {
    return (
      <AppLayout title="Tasks">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading tasks...</div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (tasks.length === 0) {
    return (
      <AppLayout title="Tasks">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button
                variant={view === 'board' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setView('board')}
                className="flex-1 sm:flex-none"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Board
              </Button>
              <Button
                variant={view === 'list' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setView('list')}
                className="flex-1 sm:flex-none"
              >
                <LayoutList className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>

            <Button size="md" onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4">
              <LayoutGrid className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first task
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          currentUser={user ?? undefined}
        />
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>

            <Button size="md" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">All</option>
                  <option value={TaskStatus.TODO} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">To Do</option>
                  <option value={TaskStatus.DOING} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Doing</option>
                  <option value={TaskStatus.COMPLETED} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Completed</option>
                  <option value={TaskStatus.ON_HOLD} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">On Hold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">All</option>
                  <option value={Priority.URGENT} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Urgent</option>
                  <option value={Priority.HIGH} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">High</option>
                  <option value={Priority.MEDIUM} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Medium</option>
                  <option value={Priority.LOW} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}

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

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
        currentUser={user ?? undefined}
      />
    </AppLayout>
  );
}

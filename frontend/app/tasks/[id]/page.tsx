'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { taskService } from '@/services/taskService';
import { commentService } from '@/services/commentService';
import { Task, Subtask, Comment, Activity, TaskStatus, Priority } from '@/types';
import { format } from 'date-fns';
import { ArrowLeft, MessageSquare, CheckSquare, Activity as ActivityIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  const loadTaskData = async () => {
    try {
      setLoading(true);
      const [taskData, subtasksData, commentsData, activitiesData] = await Promise.all([
        taskService.getTask(taskId),
        taskService.getSubtasks(taskId),
        commentService.getComments(taskId),
        taskService.getActivity(taskId),
      ]);
      setTask(taskData);
      setSubtasks(subtasksData);
      setComments(commentsData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Failed to load task data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      loadTaskData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (priority: Priority) => {
    try {
      await taskService.updateTaskPriority(taskId, priority);
      loadTaskData();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.createComment(taskId, newComment);
      setNewComment('');
      loadTaskData();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      loadTaskData();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      await taskService.createSubtask(taskId, { title: newSubtask });
      setNewSubtask('');
      loadTaskData();
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      await taskService.updateSubtask(subtaskId, { completed: !completed });
      loadTaskData();
    } catch (error) {
      console.error('Failed to update subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      await taskService.deleteSubtask(subtaskId);
      loadTaskData();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Task Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading task...</div>
        </div>
      </AppLayout>
    );
  }

  if (!task) {
    return (
      <AppLayout title="Task Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Task not found</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Task Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
            {task.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            </div>

            {/* Subtasks */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2" />
                Subtasks
              </h2>
              <form onSubmit={handleAddSubtask} className="flex space-x-2 mb-4">
                <Input
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                />
                <Button type="submit" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </form>
              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask._id, subtask.completed)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span
                        className={cn(
                          'text-sm',
                          subtask.completed
                            ? 'text-gray-500 dark:text-gray-400 line-through'
                            : 'text-gray-900 dark:text-white'
                        )}
                      >
                        {subtask.title}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubtask(subtask._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No subtasks yet</p>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comments
              </h2>
              <form onSubmit={handleAddComment} className="mb-4">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit" size="sm">
                    Post Comment
                  </Button>
                </div>
              </form>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium flex-shrink-0">
                        {comment.userId.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {comment.userId.name}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(comment.createdAt), 'MMM d, yyyy HH:mm')}
                            </span>
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Properties */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Properties
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={TaskStatus.TODO}>To Do</option>
                    <option value={TaskStatus.DOING}>Doing</option>
                    <option value={TaskStatus.COMPLETED}>Completed</option>
                    <option value={TaskStatus.ON_HOLD}>On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={Priority.NONE}>None</option>
                    <option value={Priority.LOW}>Low</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.URGENT}>Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Due Date
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'Not set'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reporter
                  </label>
                  {task.reporter && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                        {task.reporter.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {task.reporter.name}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Members
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {task.members.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1"
                      >
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-gray-900 dark:text-white">
                          {member.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <ActivityIcon className="h-5 w-5 mr-2" />
                Activity
              </h2>
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div key={activity._id} className="text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {activity.userId.name}
                      </span>{' '}
                      {activity.action.replace('_', ' ')}
                      {activity.oldValue && (
                        <span className="text-gray-500"> from {activity.oldValue}</span>
                      )}
                      {activity.newValue && (
                        <span className="text-gray-500"> to {activity.newValue}</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format(new Date(activity.createdAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

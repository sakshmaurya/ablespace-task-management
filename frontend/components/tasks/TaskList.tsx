'use client';

import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onTaskDelete: (taskId: string) => void;
}

const priorityColors = {
  URGENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  NONE: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  DOING: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  ON_HOLD: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export default function TaskList({
  tasks,
  onStatusChange,
  onTaskDelete,
}: TaskListProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([status, statusTasks]) => (
        <div key={status}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {status.replace('_', ' ')} ({statusTasks.length})
          </h3>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {statusTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </p>
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                              statusColors[task.status]
                            )}
                          >
                            {task.status}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        {task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.labels.map((label) => (
                              <span
                                key={label}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {task.priority && task.priority !== 'NONE' && (
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                            priorityColors[task.priority]
                          )}
                        >
                          {task.priority}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {task.members && task.members.length > 0 && (
                        <div className="flex -space-x-2">
                          {task.members.slice(0, 3).map((member) => (
                            <div
                              key={member._id}
                              className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs border-2 border-white dark:border-gray-900"
                              title={member.name}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {task.members.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-xs border-2 border-white dark:border-gray-900">
                              +{task.members.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {task.dueDate ? (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            onStatusChange(task._id, e.target.value as TaskStatus)
                          }
                          className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value={TaskStatus.TODO}>To Do</option>
                          <option value={TaskStatus.DOING}>Doing</option>
                          <option value={TaskStatus.COMPLETED}>Completed</option>
                          <option value={TaskStatus.ON_HOLD}>On Hold</option>
                        </select>
                        <button
                          onClick={() => onTaskDelete(task._id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

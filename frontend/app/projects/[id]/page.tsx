'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { projectService } from '@/services/projectService';
import { taskService } from '@/services/taskService';
import { Project, Task } from '@/types';
import { ArrowLeft, Plus } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getTasks({ projectId }),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (loading) {
    return (
      <AppLayout title="Project Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading project...</div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Project Details">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Project not found</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={project.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
            {project.name}
          </h1>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Project Info */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Project Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
              <p className="text-gray-900 dark:text-white mt-1">
                {project.description || 'No description provided'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Lead</p>
              <p className="text-gray-900 dark:text-white mt-1">
                {project.lead ? project.lead.name : 'Not assigned'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
              <p className="text-gray-900 dark:text-white mt-1">{project.priority}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-gray-900 dark:text-white mt-1">
                {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Project Tasks */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tasks ({tasks.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No tasks in this project</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

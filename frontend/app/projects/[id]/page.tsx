'use client';

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { projectService } from '@/services/projectService';
import { taskService } from '@/services/taskService';
import { Project, Task, Priority } from '@/types';
import { ArrowLeft, Plus, Edit, Save, X } from 'lucide-react';
import TaskCard from '@/components/tasks/TaskCard';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = params.id as string;
  const editMode = searchParams.get('edit') === 'true';

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(editMode);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    priority?: Priority;
    dueDate: string;
  }>({
    name: '',
    description: '',
    priority: undefined,
    dueDate: '',
  });

  const loadProjectData = async () => {
    try {
      setLoading(true);

      const [projectData, tasksData] = await Promise.all([
        projectService.getProject(projectId),
        taskService.getTasks({ projectId }),
      ]);

      setProject(projectData);
      setTasks(tasksData);

      setFormData({
        name: projectData.name || '',
        description: projectData.description || '',
        priority: projectData.priority,
        dueDate: projectData.dueDate
          ? new Date(projectData.dueDate).toISOString().split('T')[0]
          : '',
      });
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  useEffect(() => {
    setIsEditing(editMode);
  }, [editMode]);

  const resetForm = () => {
    if (!project) return;

    setFormData({
      name: project.name || '',
      description: project.description || '',
      priority: project.priority,
      dueDate: project.dueDate
        ? new Date(project.dueDate).toISOString().split('T')[0]
        : '',
    });
  };

  const handleStartEdit = () => {
    resetForm();
    setIsEditing(true);

    router.replace(`/projects/${projectId}?edit=true`);
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEditing(false);

    router.replace(`/projects/${projectId}`);
  };

  const handleSaveProject = async () => {
    if (!project) return;

    const projectName = formData.name.trim();

    if (!projectName) {
      alert('Project name is required.');
      return;
    }

    try {
      setSaving(true);

      const updatedProject = await projectService.updateProject(
        projectId,
        {
          name: projectName,
          description: formData.description.trim(),
          ...(formData.priority
            ? { priority: formData.priority }
            : {}),
          ...(formData.dueDate
            ? { dueDate: formData.dueDate }
            : {}),
        }
      );

      setProject(updatedProject);

      setFormData({
        name: updatedProject.name || '',
        description: updatedProject.description || '',
        priority: updatedProject.priority,
        dueDate: updatedProject.dueDate
          ? new Date(updatedProject.dueDate)
              .toISOString()
              .split('T')[0]
          : '',
      });

      setIsEditing(false);

      router.replace(`/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Project Details">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />

            <div className="text-lg text-gray-600 dark:text-gray-400">
              Loading project...
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout title="Project Details">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Project not found
          </div>

          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={isEditing ? 'Edit Project' : project.name}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/projects')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">
            {isEditing ? 'Edit Project' : project.name}
          </h1>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleStartEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>

              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Edit Project Details
            </h2>

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Project Name
                </label>

                <input
                  id="project-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="project-description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description
                </label>

                <textarea
                  id="project-description"
                  rows={4}
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Enter project description"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Priority + Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Priority */}
                <div>
                  <label
                    htmlFor="project-priority"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Priority
                  </label>

                  <select
                    id="project-priority"
                    value={formData.priority ?? ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        priority: event.target.value
                          ? (event.target.value as Priority)
                          : undefined,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">No priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label
                    htmlFor="project-due-date"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Due Date
                  </label>

                  <input
                    id="project-due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        dueDate: event.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">

                <Button
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>

                <Button
                  onClick={handleSaveProject}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>

              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Project Info */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Description
                  </p>

                  <p className="text-gray-900 dark:text-white mt-1">
                    {project.description || 'No description provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Lead
                  </p>

                  <p className="text-gray-900 dark:text-white mt-1">
                    {project.lead
                      ? project.lead.name
                      : 'Not assigned'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Priority
                  </p>

                  <p className="text-gray-900 dark:text-white mt-1">
                    {project.priority || 'No priority'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Due Date
                  </p>

                  <p className="text-gray-900 dark:text-white mt-1">
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString()
                      : 'Not set'}
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
                  <TaskCard
                    key={task._id}
                    task={task}
                  />
                ))}
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400">
                    No tasks in this project
                  </p>
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
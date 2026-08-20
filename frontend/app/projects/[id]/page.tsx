'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const priorityColors = {
  URGENT:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  HIGH:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  MEDIUM:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  LOW:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  NONE:
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );

  const { user } = useAuth();
  const router = useRouter();

  // Load projects from API
  const loadProjects = async () => {
    try {
      setLoading(true);

      const data = await projectService.getProjects();

      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Delete project
  const handleDeleteProject = async (projectId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProjectId(projectId);

      await projectService.deleteProject(projectId);

      // Immediately remove deleted project from UI
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== projectId)
      );
    } catch (error) {
      console.error('Failed to delete project:', error);

      alert('Failed to delete project. Please try again.');
    } finally {
      setDeletingProjectId(null);
    }
  };

  // Create project
  const handleProjectCreated = (newProject: Project) => {
    setProjects((currentProjects) => [
      ...currentProjects,
      newProject,
    ]);

    setIsCreateModalOpen(false);
  };

  // Open project details
  const handleOpenProject = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  // Open project edit page
  const handleEditProject = (
    event: React.MouseEvent<HTMLButtonElement>,
    projectId: string
  ) => {
    event.stopPropagation();

    router.push(`/projects/${projectId}?edit=true`);
  };

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase();

    return (
      searchTerm === '' ||
      project.name.toLowerCase().includes(search) ||
      (project.description &&
        project.description.toLowerCase().includes(search))
    );
  });

  if (loading) {
    return (
      <AppLayout title="Projects">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />

            <div className="text-lg text-gray-600 dark:text-gray-400">
              Loading projects...
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Projects">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white w-full sm:w-64"
              />
            </div>

            {/* Add Project */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Priority
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lead
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">

              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() =>
                    handleOpenProject(project._id)
                  }
                >

                  {/* Project */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </p>

                      {project.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Priority */}
                  <td className="px-6 py-4">
                    {project.priority && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          priorityColors[project.priority]
                        )}
                      >
                        {project.priority}
                      </span>
                    )}
                  </td>

                  {/* Lead */}
                  <td className="px-6 py-4">
                    {project.lead ? (
                      <div className="flex items-center">

                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mr-2">
                          {project.lead.name
                            ?.charAt(0)
                            ?.toUpperCase() || '?'}
                        </div>

                        <span className="text-sm text-gray-900 dark:text-white">
                          {project.lead.name || 'Unknown'}
                        </span>

                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">
                        —
                      </span>
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="px-6 py-4">
                    {project.dueDate ? (
                      <span className="text-sm text-gray-900 dark:text-white">
                        {format(
                          new Date(project.dueDate),
                          'MMM d, yyyy'
                        )}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        —
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">

                      {/* Edit */}
                      <button
                        type="button"
                        title="Edit project"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        onClick={(event) =>
                          handleEditProject(
                            event,
                            project._id
                          )
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        title="Delete project"
                        disabled={
                          deletingProjectId === project._id
                        }
                        onClick={(event) => {
                          event.stopPropagation();

                          handleDeleteProject(
                            project._id
                          );
                        }}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>
          </table>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">

              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-4 inline-block">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>

              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm
                  ? 'No projects found matching your search'
                  : 'No projects found'}
              </p>

              {!searchTerm && (
                <Button
                  onClick={() =>
                    setIsCreateModalOpen(true)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() =>
          setIsCreateModalOpen(false)
        }
        onProjectCreated={handleProjectCreated}
        currentUser={user || undefined}
      />

    </AppLayout>
  );
}
'use client';

import { Task, TaskStatus } from '@/types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCorners } from '@dnd-kit/core';
import { useState } from 'react';
import TaskColumn from './TaskColumn';
import TaskCard from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

const columns = [
  { id: TaskStatus.TODO, title: 'To Do', color: 'bg-gray-500' },
  { id: TaskStatus.DOING, title: 'Doing', color: 'bg-blue-500' },
  { id: TaskStatus.COMPLETED, title: 'Completed', color: 'bg-green-500' },
  { id: TaskStatus.ON_HOLD, title: 'On Hold', color: 'bg-yellow-500' },
];

export default function TaskBoard({
  tasks,
  onStatusChange,
}: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const task = tasks.find((t) => t._id === active.id);
      if (task) {
        const newStatus = over.id as TaskStatus;
        onStatusChange(task._id, newStatus);
      }
    }

    setActiveId(null);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const activeTask = activeId ? tasks.find((t) => t._id === activeId) : null;

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="w-72 opacity-50">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

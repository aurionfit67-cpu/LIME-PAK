'use client';

import { useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import type { Task } from '@/types';

const columns = [
  { id: 'todo', title: 'To Do', bgColor: 'bg-gray-500' },
  { id: 'in_progress', title: 'In Progress', bgColor: 'bg-blue-500' },
  { id: 'review', title: 'Review', bgColor: 'bg-yellow-500' },
  { id: 'done', title: 'Done', bgColor: 'bg-green-500' },
] as const;

export default function TasksPage() {
  const company = mockDataStore.getUserCompany();
  const projects = company ? mockDataStore.getCompanyProjects(company.id) : [];
  const allTasks = projects.flatMap(p => mockDataStore.getProjectTasks(p.id));
  const users = company ? mockDataStore.getCompanyUsers(company.id) : [];
  const agents = company ? mockDataStore.getCompanyAgents(company.id) : [];

  const [tasks, setTasks] = useState(allTasks);

  const getAssignee = (task: Task) => {
    if (task.assignedToUserId) {
      return users.find(u => u.id === task.assignedToUserId);
    }
    if (task.assignedToAgentId) {
      return agents.find(a => a.id === task.assignedToAgentId);
    }
    return null;
  };

  const getProject = (task: Task) => {
    return projects.find(p => p.id === task.projectId);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );

    // Update in mock store
    mockDataStore.updateTask(taskId, { status: newStatus });
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">{tasks.length} total tasks across all projects</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map(column => {
          const count = tasks.filter(t => t.status === column.id).length;
          return (
            <div key={column.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600">{column.title}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-6">
        {columns.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{column.title}</h3>
                  <span className="text-sm text-gray-500">{columnTasks.length}</span>
                </div>
                <div className={`h-1 rounded-full ${column.bgColor}`} />
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
                className="flex-1 space-y-3 min-h-[200px] bg-gray-50 rounded-xl p-3 border-2 border-dashed border-gray-200"
              >
                {columnTasks.map(task => {
                  const assignee = getAssignee(task);
                  const project = getProject(task);
                  const isAgent = !!task.assignedToAgentId;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-move"
                    >
                      {/* Priority Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Task Title */}
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Project Tag */}
                      {project && (
                        <div className="mb-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
                            {project.name}
                          </span>
                        </div>
                      )}

                      {/* Assignee */}
                      {assignee && (
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                            isAgent 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                              : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {isAgent ? '🤖' : (assignee as any).avatar}
                          </div>
                          <span className="text-xs text-gray-600 truncate">
                            {assignee.name}
                          </span>
                        </div>
                      )}

                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <span>📅</span>
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

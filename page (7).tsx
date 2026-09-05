import Link from 'next/link';
import { mockDataStore } from '@/lib/mockData';

export default function ProjectsPage() {
  const company = mockDataStore.getUserCompany();
  const projects = company ? mockDataStore.getCompanyProjects(company.id) : [];
  const users = company ? mockDataStore.getCompanyUsers(company.id) : [];
  const agents = company ? mockDataStore.getCompanyAgents(company.id) : [];

  const getProjectMembers = (project: typeof projects[0]) => {
    const members = project.memberIds.map(id => users.find(u => u.id === id)).filter(Boolean);
    const projectAgents = project.agentIds.map(id => agents.find(a => a.id === id)).filter(Boolean);
    return { members, projectAgents };
  };

  const getProjectTasks = (projectId: string) => {
    return mockDataStore.getProjectTasks(projectId);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    paused: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">{projects.length} total projects</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          + New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
          <div className="text-sm text-gray-600">Total Projects</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">✓</div>
          <div className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) || 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Progress</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">
            {new Set(projects.flatMap(p => [...p.memberIds, ...p.agentIds])).size}
          </div>
          <div className="text-sm text-gray-600">Total Contributors</div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => {
          const { members, projectAgents } = getProjectMembers(project);
          const tasks = getProjectTasks(project.id);
          const completedTasks = tasks.filter(t => t.status === 'done').length;

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">✓</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{completedTasks}/{tasks.length}</div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">👥</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{members.length}</div>
                    <div className="text-xs text-gray-600">Team Members</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{projectAgents.length}</div>
                    <div className="text-xs text-gray-600">AI Agents</div>
                  </div>
                </div>
              </div>

              {/* Team Avatars */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Team:</span>
                <div className="flex -space-x-2">
                  {members.slice(0, 5).map((member) => (
                    <div
                      key={member!.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm border-2 border-white"
                      title={member!.name}
                    >
                      {member!.avatar}
                    </div>
                  ))}
                  {projectAgents.slice(0, 3).map((agent) => (
                    <div
                      key={agent!.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-sm border-2 border-white"
                      title={agent!.name}
                    >
                      🤖
                    </div>
                  ))}
                  {(members.length + projectAgents.length > 8) && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                      +{members.length + projectAgents.length - 8}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Yet</h2>
          <p className="text-gray-600 mb-6">Create your first project to get started</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}

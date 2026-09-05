'use client';

import { mockDataStore } from '@/lib/mockData';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();
  const company = mockDataStore.getUserCompany();
  const users = company ? mockDataStore.getCompanyUsers(company.id) : [];
  const agents = company ? mockDataStore.getCompanyAgents(company.id) : [];
  const projects = company ? mockDataStore.getCompanyProjects(company.id) : [];
  const allTasks = projects.flatMap(p => mockDataStore.getProjectTasks(p.id));
  const openTasks = allTasks.filter(t => t.status !== 'done');

  if (!company) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">No company found</h1>
          <p className="text-gray-600 mt-2">Please create a company to get started.</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Team Members', value: users.length, icon: '👥', bgColor: 'bg-blue-100' },
    { label: 'AI Agents', value: agents.length, icon: '🤖', bgColor: 'bg-purple-100' },
    { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: '📋', bgColor: 'bg-green-100' },
    { label: 'Open Tasks', value: openTasks.length, icon: '✓', bgColor: 'bg-orange-100' },
  ];

  const recentActivity = [
    { action: 'Agent created', description: 'Nova joined the Product team', time: '2 hours ago', icon: '🤖' },
    { action: 'Task completed', description: 'Q1 Financial Review finished', time: '5 hours ago', icon: '✓' },
    { action: 'Project updated', description: 'Q1 Product Launch progress: 65%', time: '1 day ago', icon: '📋' },
    { action: 'New member', description: 'David Kim joined as CMO', time: '2 days ago', icon: '👤' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with {company.name} today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Goals */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Company Goals</h2>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="space-y-4">
            {company.goals.map((goal, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Active Projects</h2>
          <span className="text-2xl">📋</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.filter(p => p.status === 'active').map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

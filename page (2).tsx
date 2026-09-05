import Link from 'next/link';
import { mockDataStore } from '@/lib/mockData';

export default function AgentsPage() {
  const company = mockDataStore.getUserCompany();
  const agents = company ? mockDataStore.getCompanyAgents(company.id) : [];

  const groupByDepartment = (agentList: typeof agents) => {
    const grouped: Record<string, typeof agentList> = {};
    agentList.forEach(agent => {
      const dept = agent.department || 'General';
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(agent);
    });
    return grouped;
  };

  const departments = groupByDepartment(agents);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600 mt-1">{agents.length} AI agents working across your company</p>
        </div>
        <Link
          href="/agents/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-block"
        >
          + Create Agent
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-3xl font-bold">{agents.length}</div>
          <div className="text-blue-100 text-sm">Total Agents</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">✓</div>
          <div className="text-3xl font-bold">{agents.filter(a => a.status === 'active').length}</div>
          <div className="text-green-100 text-sm">Active</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-3xl font-bold">{Object.keys(departments).length}</div>
          <div className="text-purple-100 text-sm">Departments</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-3xl font-bold">24/7</div>
          <div className="text-orange-100 text-sm">Always Available</div>
        </div>
      </div>

      {/* Agents by Department */}
      <div className="space-y-6">
        {Object.entries(departments).map(([department, deptAgents]) => (
          <div key={department} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{department}</h2>
                <p className="text-sm text-gray-600">{deptAgents.length} {deptAgents.length === 1 ? 'agent' : 'agents'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptAgents.map((agent) => (
                <Link
                  key={agent.id}
                  href={`/agents/${agent.id}`}
                  className="block group"
                >
                  <div className="p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                        🤖
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {agent.status}
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mb-2">{agent.role}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{agent.purpose}</p>

                    <div className="flex flex-wrap gap-2">
                      {agent.tools.slice(0, 3).map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                      {agent.tools.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          +{agent.tools.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No AI Agents Yet</h2>
          <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
          <Link
            href="/agents/new"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors inline-block"
          >
            Create Your First Agent
          </Link>
        </div>
      )}
    </div>
  );
}

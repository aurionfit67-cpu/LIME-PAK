import { mockDataStore } from '@/lib/mockData';

export default function TeamPage() {
  const company = mockDataStore.getUserCompany();
  const users = company ? mockDataStore.getCompanyUsers(company.id) : [];

  const groupByDepartment = (userList: Array<{id: string; name: string; email: string; avatar: string; role: string; department: string}>) => {
    const grouped: Record<string, typeof userList> = {};
    userList.forEach(user => {
      const dept = user.department || 'Other';
      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push(user);
    });
    return grouped;
  };

  const departments = groupByDepartment(users);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">{users.length} team members across {Object.keys(departments).length} departments</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          + Add Member
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          <div className="text-sm text-gray-600">Total Members</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-2xl font-bold text-gray-900">{Object.keys(departments).length}</div>
          <div className="text-sm text-gray-600">Departments</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">👔</div>
          <div className="text-2xl font-bold text-gray-900">{users.filter(u => ['CEO', 'CFO', 'COO', 'CTO', 'CMO'].includes(u.role)).length}</div>
          <div className="text-sm text-gray-600">C-Suite</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-gray-900">+25%</div>
          <div className="text-sm text-gray-600">Growth this year</div>
        </div>
      </div>

      {/* Departments */}
      <div className="space-y-6">
        {Object.entries(departments).map(([department, members]) => (
          <div key={department} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{department}</h2>
                <p className="text-sm text-gray-600">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-sm font-medium text-blue-600">{member.role}</div>
                    <div className="text-xs text-gray-500 mt-1">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

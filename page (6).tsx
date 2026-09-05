import { mockDataStore } from '@/lib/mockData';

export default function OrganizationPage() {
  const company = mockDataStore.getUserCompany();
  const users = company ? mockDataStore.getCompanyUsers(company.id) : [];

  const ceo = users.find(u => u.role === 'CEO');
  const csuite = users.filter(u => u.role !== 'CEO' && ['CFO', 'COO', 'CTO', 'CMO', 'CHRO', 'CPO', 'CRO', 'CLO', 'CSO'].includes(u.role));

  const roleDescriptions: Record<string, string> = {
    CEO: 'Chief Executive Officer - Overall company strategy and vision',
    CFO: 'Chief Financial Officer - Financial planning and management',
    COO: 'Chief Operating Officer - Day-to-day operations',
    CTO: 'Chief Technology Officer - Technology strategy and development',
    CMO: 'Chief Marketing Officer - Marketing and brand strategy',
    CHRO: 'Chief Human Resources Officer - People and culture',
    CPO: 'Chief Product Officer - Product strategy and development',
    CRO: 'Chief Revenue Officer - Revenue growth and sales',
    CLO: 'Chief Legal Officer - Legal and compliance',
    CSO: 'Chief Security Officer - Security and risk management',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Organization</h1>
        <p className="text-gray-600 mt-1">Company structure and leadership team</p>
      </div>

      {/* Company Info */}
      {company && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{company.name}</h2>
                <p className="text-blue-100 mt-2">{company.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div>
                  <div className="text-blue-100 text-sm">Industry</div>
                  <div className="text-lg font-semibold">{company.industry}</div>
                </div>
                <div>
                  <div className="text-blue-100 text-sm">Team Size</div>
                  <div className="text-lg font-semibold">{users.length} members</div>
                </div>
                <div>
                  <div className="text-blue-100 text-sm">Founded</div>
                  <div className="text-lg font-semibold">{company.createdAt.getFullYear()}</div>
                </div>
              </div>
            </div>
            <div className="text-6xl">🏢</div>
          </div>
        </div>
      )}

      {/* Organization Chart */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Leadership Structure</h2>

        {/* CEO */}
        {ceo && (
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 w-80 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-3xl">
                    {ceo.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold">{ceo.name}</div>
                    <div className="text-blue-100">{ceo.role}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-blue-100">
                  {roleDescriptions[ceo.role]}
                </div>
              </div>
              {csuite.length > 0 && (
                <div className="absolute left-1/2 -bottom-8 w-0.5 h-8 bg-gray-300 transform -translate-x-1/2" />
              )}
            </div>
          </div>
        )}

        {/* C-Suite Grid */}
        {csuite.length > 0 && (
          <div className="relative">
            {/* Horizontal line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-300" style={{ top: '-1px' }} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {csuite.map((member) => (
                <div key={member.id} className="relative">
                  {/* Vertical connector */}
                  <div className="absolute left-1/2 -top-8 w-0.5 h-8 bg-gray-300 transform -translate-x-1/2" />
                  
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900">{member.name}</div>
                        <div className="text-sm font-medium text-blue-600">{member.role}</div>
                        <div className="text-xs text-gray-500 mt-1">{member.department}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      {roleDescriptions[member.role]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {csuite.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No C-Suite Members</h3>
            <p className="text-gray-600">Add team members and assign C-suite positions</p>
          </div>
        )}
      </div>

      {/* Mission & Vision */}
      {company && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900">Mission</h3>
            </div>
            <p className="text-gray-700">{company.mission}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
                🔮
              </div>
              <h3 className="text-xl font-bold text-gray-900">Vision</h3>
            </div>
            <p className="text-gray-700">{company.vision}</p>
          </div>
        </div>
      )}
    </div>
  );
}

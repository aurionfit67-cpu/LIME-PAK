'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    name: 'Company',
    icon: '🏢',
    children: [
      { name: 'Organization', href: '/organization', icon: '🏛️' },
      { name: 'Team', href: '/team', icon: '👥' },
    ],
  },
  {
    name: 'AI Workforce',
    icon: '🤖',
    children: [
      { name: 'Agents', href: '/agents', icon: '🤖' },
      { name: 'Agent Builder', href: '/agents/new', icon: '⚙️' },
    ],
  },
  {
    name: 'Work',
    icon: '💼',
    children: [
      { name: 'Projects', href: '/projects', icon: '📋' },
      { name: 'Tasks', href: '/tasks', icon: '✓' },
    ],
  },
  {
    name: 'Knowledge',
    icon: '📚',
    children: [
      { name: 'Company Knowledge', href: '/knowledge', icon: '💡' },
    ],
  },
  {
    name: 'Build',
    icon: '🛠️',
    children: [
      { name: 'Website Builder', href: '/website', icon: '🌐' },
      { name: 'App Builder', href: '/apps', icon: '📱' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
            🚀
          </div>
          <div>
            <div className="font-bold text-lg text-gray-900">AI Company</div>
            <div className="text-xs text-gray-500">Builder</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.href ? (
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ) : (
              <div className="mt-4 mb-2">
                <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.children && (
                  <div className="mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center gap-3 px-3 py-2 pl-6 rounded-lg text-sm transition-colors ${
                          pathname === child.href
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base">{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">
            {user?.avatar || '👤'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Loading...'}
            </div>
            <div className="text-xs text-gray-500">{user?.role || ''}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sign out"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

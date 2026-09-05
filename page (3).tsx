export default function AppsPage() {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto text-center py-20">
        <div className="text-8xl mb-8">📱</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">App Builder</h1>
        <p className="text-xl text-gray-600 mb-8">
          Generate complete mobile and web applications with AI
        </p>
        
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-blue-100 mb-6">
            We're working on an incredible AI-powered app builder that will let you create
            production-ready applications in minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="px-6 py-3 bg-white bg-opacity-20 rounded-xl">
              <div className="text-sm text-blue-100">Feature</div>
              <div className="font-bold">React Native Apps</div>
            </div>
            <div className="px-6 py-3 bg-white bg-opacity-20 rounded-xl">
              <div className="text-sm text-blue-100">Feature</div>
              <div className="font-bold">Full Stack Apps</div>
            </div>
            <div className="px-6 py-3 bg-white bg-opacity-20 rounded-xl">
              <div className="text-sm text-blue-100">Feature</div>
              <div className="font-bold">API Integration</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">
              Generate complete applications in minutes, not months
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-900 mb-2">Beautiful Design</h3>
            <p className="text-sm text-gray-600">
              Modern, responsive designs that users will love
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">🔧</div>
            <h3 className="font-bold text-gray-900 mb-2">Production Ready</h3>
            <p className="text-sm text-gray-600">
              Clean code that's ready to deploy immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

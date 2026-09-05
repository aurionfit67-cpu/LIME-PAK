'use client';

import { useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import Link from 'next/link';

export default function WebsitePage() {
  const company = mockDataStore.getUserCompany();
  const [websites, setWebsites] = useState(
    company ? mockDataStore.getCompanyWebsites(company.id) : []
  );
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !company) return;

    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/website/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate website');
      }

      const data = await res.json();
      setWebsites(prev => [...prev, data.website]);
      setPrompt('');
      setShowBuilder(false);
    } catch (err) {
      console.error('Error generating website:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate website. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Builder</h1>
          <p className="text-gray-600 mt-1">Generate beautiful websites with AI</p>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {showBuilder ? 'Close Builder' : '+ New Website'}
        </button>
      </div>

      {/* Website Builder */}
      {showBuilder && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Generate Your Website</h2>
              <p className="text-blue-100">Describe your website and let AI create it for you</p>
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-30 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-500 outline-none resize-none"
                placeholder="E.g., Create a modern website for my AI company. Include a hero section, features, testimonials, and pricing..."
                disabled={isGenerating}
              />
              
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full mt-4 px-6 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </span>
                ) : (
                  '✨ Generate Website'
                )}
              </button>
            </div>

            {/* Examples */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                'Modern SaaS landing page',
                'Professional portfolio site',
                'E-commerce storefront',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setPrompt(`Create a ${example.toLowerCase()} for ${company?.name || 'my company'}`)}
                  className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl text-sm transition-colors text-left"
                  disabled={isGenerating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Websites Grid */}
      {websites.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Your Websites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((website) => (
              <Link
                key={website.id}
                href={`/website/${website.id}`}
                className="block group"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">🌐</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      website.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {website.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {website.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                    {website.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(website.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Edit →
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {website.content?.sections?.slice(0, 3).map((section: any) => (
                      <span
                        key={section.id}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                      >
                        {section.type}
                      </span>
                    ))}
                    {website.content?.sections?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                        +{website.content.sections.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        !showBuilder && (
          <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Websites Yet</h2>
            <p className="text-gray-600 mb-6">
              Generate your first AI-powered website in seconds
            </p>
            <button
              onClick={() => setShowBuilder(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Website
            </button>
          </div>
        )
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-gray-900 mb-2">Instant Generation</h3>
          <p className="text-sm text-gray-600">
            Generate complete websites in seconds with AI
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-3">🎨</div>
          <h3 className="font-bold text-gray-900 mb-2">Fully Customizable</h3>
          <p className="text-sm text-gray-600">
            Edit every section and element to match your vision
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-3">📱</div>
          <h3 className="font-bold text-gray-900 mb-2">Responsive Design</h3>
          <p className="text-sm text-gray-600">
            All websites are mobile-friendly out of the box
          </p>
        </div>
      </div>
    </div>
  );
}

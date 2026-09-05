'use client';

import { use, useState } from 'react';
import { mockDataStore } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

// Website Section Components
function NavbarSection({ content }: { content: any }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900">{content.logo}</div>
        <div className="flex gap-6">
          {content.links.map((link: string) => (
            <a key={link} href="#" className="text-gray-600 hover:text-gray-900">
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ content }: { content: any }) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">{content.headline}</h1>
        <p className="text-xl text-blue-100 mb-8">{content.subheadline}</p>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
          {content.cta}
        </button>
      </div>
    </div>
  );
}

function FeaturesSection({ content }: { content: any }) {
  return (
    <div className="bg-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">{content.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.features.map((feature: any, idx: number) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutSection({ content }: { content: any }) {
  return (
    <div className="bg-gray-50 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">{content.title}</h2>
        <p className="text-lg text-gray-700">{content.description}</p>
      </div>
    </div>
  );
}

function CTASection({ content }: { content: any }) {
  return (
    <div className="bg-blue-600 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">{content.title}</h2>
        <p className="text-xl text-blue-100 mb-8">{content.description}</p>
        <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors">
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}

function FooterSection({ content }: { content: any }) {
  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{content.company}</h3>
          </div>
          {Object.entries(content.links).map(([category, links]: [string, any]) => (
            <div key={category}>
              <h4 className="font-semibold mb-3">{category}</h4>
              <ul className="space-y-2 text-gray-400">
                {links.map((link: string) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © 2024 {content.company}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function WebsiteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const website = mockDataStore.websites.find(w => w.id === id);
  
  const [mode, setMode] = useState<'edit' | 'preview'>('preview');

  if (!website) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Website not found</h1>
        </div>
      </div>
    );
  }

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'navbar':
        return <NavbarSection key={section.id} content={section.content} />;
      case 'hero':
        return <HeroSection key={section.id} content={section.content} />;
      case 'features':
        return <FeaturesSection key={section.id} content={section.content} />;
      case 'about':
        return <AboutSection key={section.id} content={section.content} />;
      case 'cta':
        return <CTASection key={section.id} content={section.content} />;
      case 'footer':
        return <FooterSection key={section.id} content={section.content} />;
      default:
        return null;
    }
  };

  const handlePublish = () => {
    mockDataStore.updateWebsite(id, { published: !website.published });
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <div>
            <h1 className="font-bold text-gray-900">{website.name}</h1>
            <p className="text-sm text-gray-600">{website.content.sections?.length || 0} sections</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'edit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={handlePublish}
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${
              website.published
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {website.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'preview' ? (
          <div className="bg-white">
            {website.content.sections?.map((section: any) => renderSection(section))}
          </div>
        ) : (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🚧</div>
              <h3 className="font-bold text-gray-900 mb-2">Edit Mode</h3>
              <p className="text-gray-600 text-sm">
                Section editing will be available soon. For now, you can preview and publish your website.
              </p>
            </div>

            {/* Section List */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Sections</h3>
              <div className="space-y-3">
                {website.content.sections?.map((section: any, index: number) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{index + 1}</span>
                      <span className="font-medium text-gray-900 capitalize">{section.type}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

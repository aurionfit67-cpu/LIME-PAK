'use client';

import { useState } from 'react';
import { mockDataStore } from '@/lib/mockData';

export default function KnowledgePage() {
  const company = mockDataStore.getUserCompany();
  const knowledgeItems = company ? mockDataStore.getCompanyKnowledge(company.id) : [];
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    const newKnowledge = {
      id: `knowledge-${Date.now()}`,
      companyId: company.id,
      ...formData,
      createdAt: new Date(),
    };

    mockDataStore.addKnowledge(newKnowledge);
    setFormData({ title: '', content: '', type: 'note' });
    setShowNewForm(false);
  };

  const typeIcons: Record<string, string> = {
    note: '📝',
    document: '📄',
    link: '🔗',
    guide: '📚',
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Knowledge</h1>
          <p className="text-gray-600 mt-1">Centralized knowledge base for your company</p>
        </div>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          {showNewForm ? 'Cancel' : '+ Add Knowledge'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-2xl font-bold text-gray-900">{knowledgeItems.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-gray-900">{knowledgeItems.filter(k => k.type === 'note').length}</div>
          <div className="text-sm text-gray-600">Notes</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">📄</div>
          <div className="text-2xl font-bold text-gray-900">{knowledgeItems.filter(k => k.type === 'document').length}</div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-2xl font-bold text-gray-900">100%</div>
          <div className="text-sm text-gray-600">Searchable</div>
        </div>
      </div>

      {/* New Knowledge Form */}
      {showNewForm && (
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-300 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Knowledge</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="e.g., Brand Guidelines, Customer Personas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="note">Note</option>
                <option value="document">Document</option>
                <option value="link">Link</option>
                <option value="guide">Guide</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                placeholder="Enter the knowledge content..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Add Knowledge
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Knowledge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{typeIcons[item.type] || '📄'}</div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {item.type}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                {item.createdAt.toLocaleDateString()}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {knowledgeItems.length === 0 && !showNewForm && (
        <div className="bg-white rounded-2xl p-12 border border-gray-200 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Knowledge Items Yet</h2>
          <p className="text-gray-600 mb-6">Start building your company knowledge base</p>
          <button
            onClick={() => setShowNewForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
}

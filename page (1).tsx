'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockDataStore } from '@/lib/mockData';

export default function NewAgentPage() {
  const router = useRouter();
  const company = mockDataStore.getUserCompany();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    purpose: '',
    personality: '',
    instructions: '',
    goals: [''],
    tools: [] as string[],
    permissions: [] as string[],
  });

  const availableTools = [
    'Data Analysis',
    'Content Generation',
    'Market Research',
    'Financial Modeling',
    'Code Generation',
    'Email Management',
    'Calendar Management',
    'Document Processing',
    'Social Media',
    'SEO Analysis',
    'Customer Support',
    'Reporting',
  ];

  const availablePermissions = [
    'Read all data',
    'Write to database',
    'Send emails',
    'Access analytics',
    'Manage content',
    'Create reports',
    'Access financial data',
    'Modify settings',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) return;

    const newAgent = {
      id: `agent-${Date.now()}`,
      companyId: company.id,
      ...formData,
      goals: formData.goals.filter(g => g.trim() !== ''),
      status: 'active',
      createdAt: new Date(),
    };

    mockDataStore.addAgent(newAgent);
    router.push('/agents');
  };

  const addGoal = () => {
    setFormData({ ...formData, goals: [...formData.goals, ''] });
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData({ ...formData, goals: newGoals });
  };

  const removeGoal = (index: number) => {
    const newGoals = formData.goals.filter((_, i) => i !== index);
    setFormData({ ...formData, goals: newGoals });
  };

  const toggleTool = (tool: string) => {
    const tools = formData.tools.includes(tool)
      ? formData.tools.filter(t => t !== tool)
      : [...formData.tools, tool];
    setFormData({ ...formData, tools });
  };

  const togglePermission = (permission: string) => {
    const permissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    setFormData({ ...formData, permissions });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create AI Agent</h1>
        <p className="text-gray-600 mt-1">Configure your new AI team member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="e.g., Atlas, Mercury, Nova"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="e.g., Marketing Strategist"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                <option value="">Select department</option>
                <option value="Executive">Executive</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose *
            </label>
            <textarea
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              placeholder="What is this agent's primary purpose?"
            />
          </div>
        </div>

        {/* Personality & Instructions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Personality & Behavior</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personality
            </label>
            <input
              type="text"
              value={formData.personality}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="e.g., Analytical, creative, detail-oriented"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
              placeholder="Specific instructions on how this agent should behave and respond..."
            />
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Goals</h2>
            <button
              type="button"
              onClick={addGoal}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
            >
              + Add Goal
            </button>
          </div>

          <div className="space-y-3">
            {formData.goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder={`Goal ${index + 1}`}
                />
                {formData.goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Tools & Capabilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableTools.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  formData.tools.includes(tool)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availablePermissions.map((permission) => (
              <label
                key={permission}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700">{permission}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
}

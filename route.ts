import { NextResponse } from 'next/server';
import { mockDataStore } from '@/lib/mockData';

// GET /api/agents - List all agents for the current company
export async function GET() {
  try {
    const company = mockDataStore.getUserCompany();
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    const agents = mockDataStore.getCompanyAgents(company.id);
    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: Request) {
  try {
    const company = mockDataStore.getUserCompany();
    if (!company) {
      return NextResponse.json({ error: 'No company found' }, { status: 404 });
    }

    const body = await request.json();
    const newAgent = {
      id: `agent-${Date.now()}`,
      companyId: company.id,
      ...body,
      status: 'active',
      createdAt: new Date(),
    };

    mockDataStore.addAgent(newAgent);
    return NextResponse.json({ agent: newAgent }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

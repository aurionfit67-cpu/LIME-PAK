import { User, AuthServiceInterface } from './AuthService';

// Mock users for development
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'ceo@acme.com': {
    password: 'password',
    user: {
      id: 'user-1',
      email: 'ceo@acme.com',
      name: 'Sarah Chen',
      avatar: '👩‍💼',
      role: 'CEO',
    },
  },
  'demo@acme.com': {
    password: 'password',
    user: {
      id: 'user-6',
      email: 'demo@acme.com',
      name: 'Demo User',
      avatar: '👤',
      role: 'Member',
    },
  },
};

export class MockAuthService implements AuthServiceInterface {
  async login(email: string, password: string): Promise<User> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));

    const entry = MOCK_USERS[email.toLowerCase()];
    if (!entry || entry.password !== password) {
      throw new Error('Invalid email or password');
    }

    return entry.user;
  }

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  }

  async getCurrentUser(): Promise<User | null> {
    return null; // Checked via session/cookie in real implementation
  }
}

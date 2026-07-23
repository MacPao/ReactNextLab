import { UserAccount } from '../types/poc';
import { mockUsers } from '../data/pocData';

let inMemoryUsers: UserAccount[] = [...mockUsers];

export const userService = {
  /**
   * GET /api/v1/users
   */
  async getUsers(): Promise<UserAccount[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...inMemoryUsers];
  },

  /**
   * POST /api/v1/users (Create Local Account)
   */
  async createLocalUser(user: Omit<UserAccount, 'userId' | 'lastLogin'>): Promise<UserAccount> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const newUser: UserAccount = {
      ...user,
      userId: `usr_local_${Date.now()}`,
      accountType: 'LOCAL',
      lastLogin: 'Never',
    };
    inMemoryUsers.push(newUser);
    return newUser;
  },

  /**
   * PUT /api/v1/users/:userId/role
   */
  async updateUserRole(userId: string, roleId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    inMemoryUsers = inMemoryUsers.map((u) =>
      u.userId === userId ? { ...u, roleId } : u
    );
    return true;
  },

  /**
   * PATCH /api/v1/users/:userId/status
   */
  async toggleUserStatus(userId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    inMemoryUsers = inMemoryUsers.map((u) => {
      if (u.userId === userId) {
        return {
          ...u,
          status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE',
        };
      }
      return u;
    });
    return true;
  },

  /**
   * POST /api/v1/ad-directory/sync (Active Directory Directory Synchronization)
   */
  async syncActiveDirectory(): Promise<{ syncedCount: number; timestamp: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AD LDAP / Graph API directory query
    return {
      syncedCount: inMemoryUsers.filter((u) => u.accountType === 'AD').length,
      timestamp: new Date().toISOString(),
    };
  },
};

export const userSqlSchemaDdl = `-- Active Directory (AD) & Local User Management Database Schema

-- 1. Users Master Table
CREATE TABLE sys_users (
    user_id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(128) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    account_type VARCHAR(16) NOT NULL CHECK (account_type IN ('AD', 'LOCAL')),
    upn VARCHAR(255) UNIQUE, -- Active Directory User Principal Name (e.g. user@corp.domain)
    department VARCHAR(128),
    title VARCHAR(128),
    role_id VARCHAR(64) REFERENCES sys_roles(role_id),
    status VARCHAR(16) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISABLED')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for AD lookup and LDAP synchronization
CREATE INDEX idx_users_upn ON sys_users(upn);
CREATE INDEX idx_users_account_type ON sys_users(account_type);
`;

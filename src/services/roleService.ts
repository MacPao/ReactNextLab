import { RoleDefinition, FunctionPermissionItem } from '../types/poc';
import { mockRoles, mockFunctionPermissions } from '../data/pocData';

/**
 * Enterprise RBAC Service Layer
 * Simulates standard RESTful API backend interactions.
 */

// In-memory state for mock backend storage
let inMemoryRoles: RoleDefinition[] = [...mockRoles];

export const roleService = {
  /**
   * GET /api/v1/roles
   * Fetches all configured system and custom roles
   */
  async getRoles(): Promise<RoleDefinition[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...inMemoryRoles];
  },

  /**
   * GET /api/v1/permissions
   * Fetches master list of function usage permissions
   */
  async getPermissions(): Promise<FunctionPermissionItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [...mockFunctionPermissions];
  },

  /**
   * PUT /api/v1/roles/:roleId/permissions
   * Updates authorization matrix for a given role ID
   */
  async updateRolePermissions(
    roleId: string,
    permissions: Record<string, boolean>
  ): Promise<{ success: boolean; roleId: string; updatedAt: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    inMemoryRoles = inMemoryRoles.map((role) => {
      if (role.roleId === roleId) {
        return {
          ...role,
          permissions: { ...permissions },
        };
      }
      return role;
    });

    return {
      success: true,
      roleId,
      updatedAt: new Date().toISOString(),
    };
  },

  /**
   * POST /api/v1/roles
   * Creates a new custom system role
   */
  async createRole(newRole: RoleDefinition): Promise<RoleDefinition> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    inMemoryRoles.push(newRole);
    return newRole;
  },
};

/**
 * Backend Reference SQL DDL Schema Specification
 */
export const sqlSchemaDdl = `-- Enterprise RBAC Database Schema (PostgreSQL / MySQL)

-- 1. Roles Master Table
CREATE TABLE sys_roles (
    role_id VARCHAR(64) PRIMARY KEY,
    role_code VARCHAR(64) NOT NULL UNIQUE,
    name_zh_tw VARCHAR(255) NOT NULL,
    name_zh_cn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_ja VARCHAR(255) NOT NULL,
    description_zh_tw TEXT,
    description_zh_cn TEXT,
    description_en TEXT,
    description_ja TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    assigned_user_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Function Usage Permissions Master Table
CREATE TABLE sys_permissions (
    permission_key VARCHAR(64) PRIMARY KEY,
    category VARCHAR(64) NOT NULL,
    label_zh_tw VARCHAR(255) NOT NULL,
    label_zh_cn VARCHAR(255) NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    label_ja VARCHAR(255) NOT NULL
);

-- 3. Role-Permission Junction Table (Authorization Matrix)
CREATE TABLE sys_role_permissions (
    role_id VARCHAR(64) REFERENCES sys_roles(role_id) ON DELETE CASCADE,
    permission_key VARCHAR(64) REFERENCES sys_permissions(permission_key) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_key)
);
`;

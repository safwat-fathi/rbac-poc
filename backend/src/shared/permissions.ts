export const RESOURCES = {
  INVOICES: 'invoices',
  CLIENTS: 'clients',
  PURCHASES: 'purchases',
  USERS: 'users',
  SYSTEM: 'system'
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve'
} as const;

export const PERMISSIONS = {
  // Invoices
  INVOICES_READ: 'invoices:read',
  INVOICES_CREATE: 'invoices:create',
  INVOICES_UPDATE: 'invoices:update',
  INVOICES_DELETE: 'invoices:delete',
  INVOICES_APPROVE: 'invoices:approve',

  // Clients
  CLIENTS_READ: 'clients:read',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_UPDATE: 'clients:update',
  CLIENTS_DELETE: 'clients:delete',

  // Purchases
  PURCHASES_READ: 'purchases:read',
  PURCHASES_CREATE: 'purchases:create',
  PURCHASES_APPROVE: 'purchases:approve',
  
  // System
  USERS_MANAGE: 'users:manage',
  ROLES_MANAGE: 'roles:manage',

	// items
	ITEMS_READ: 'items:read',
	ITEMS_CREATE: 'items:create',
	ITEMS_UPDATE: 'items:update',
	ITEMS_DELETE: 'items:delete',
} as const;

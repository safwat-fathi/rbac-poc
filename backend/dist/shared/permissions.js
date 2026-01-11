"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PERMISSIONS = exports.ACTIONS = exports.RESOURCES = void 0;
exports.RESOURCES = {
    INVOICES: 'invoices',
    CLIENTS: 'clients',
    PURCHASES: 'purchases',
    USERS: 'users',
    SYSTEM: 'system'
};
exports.ACTIONS = {
    CREATE: 'create',
    READ: 'read',
    UPDATE: 'update',
    DELETE: 'delete',
    APPROVE: 'approve'
};
exports.PERMISSIONS = {
    INVOICES_READ: 'invoices:read',
    INVOICES_CREATE: 'invoices:create',
    INVOICES_UPDATE: 'invoices:update',
    INVOICES_DELETE: 'invoices:delete',
    INVOICES_APPROVE: 'invoices:approve',
    CLIENTS_READ: 'clients:read',
    CLIENTS_CREATE: 'clients:create',
    CLIENTS_UPDATE: 'clients:update',
    CLIENTS_DELETE: 'clients:delete',
    PURCHASES_READ: 'purchases:read',
    PURCHASES_CREATE: 'purchases:create',
    PURCHASES_APPROVE: 'purchases:approve',
    USERS_MANAGE: 'users:manage',
    ROLES_MANAGE: 'roles:manage',
    ITEMS_READ: 'items:read',
    ITEMS_CREATE: 'items:create',
    ITEMS_UPDATE: 'items:update',
    ITEMS_DELETE: 'items:delete',
};
//# sourceMappingURL=permissions.js.map
# Small ERP RBAC POC - Complete Implementation Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Type Definitions](#type-definitions)
5. [Database Schema (TypeORM)](#database-schema-typeorm)
6. [Backend Implementation (NestJS)](#backend-implementation-nestjs)
7. [Frontend Implementation (Next.js 16 + Zustand)](#frontend-implementation-nextjs-16--zustand)
8. [Setup & Running](#setup--running)

---

## Overview

### POC Scope
A small ERP system demonstrating RBAC capabilities through common business operations:
- **Invoices**: Manage customer invoices (Create, Read, Update, Delete, Approve).
- **Clients**: Manage client database.
- **Purchases**: Handle company subscriptions and expenses.
- **RBAC**: Granular permissions (Admin, Manager, Accountant, Sales).

### Key Features
- ✅ JWT-based authentication
- ✅ Role-Based & Permission-Based Access Control
- ✅ Zustand for State Management (No Context API)
- ✅ TypeORM for Database Interaction
- ✅ Next.js 16 (Latest)

---

## Tech Stack

### Backend
- **Framework**: NestJS 10.x
- **Database**: PostgreSQL
- **ORM**: TypeORM 0.3.x
- **Auth**: JWT (passport-jwt)
- **Validation**: class-validator

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

---

## Project Structure

```
project-root/
├── backend/                    # NestJS application
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── clients/            # ERP Module
│   │   ├── invoices/           # ERP Module
│   │   ├── purchases/          # ERP Module
│   │   ├── rbac/
│   │   ├── database/
│   │   └── main.ts
│   ├── package.json
│   └── pnpm-lock.yaml
│
├── frontend/                   # Next.js 16 application
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   │   ├── clients/
│   │   │   ├── invoices/
│   │   │   └── purchases/
│   │   └── layout.tsx
│   ├── components/
│   ├── stores/                 # Zustand Stores
│   │   ├── useAuthStore.ts
│   │   ├── useClientStore.ts
│   │   └── useInvoiceStore.ts
│   ├── lib/
│   └── package.json
│
└── package.json                # Root (if monorepo)
```

---

## Type Definitions

### Permissions Constants (`shared/permissions.ts`)

```typescript
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
  APPROVE: 'approve' // Specific to invoices/purchases
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
} as const;
```

---

## Database Schema (TypeORM)

### Entities

#### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  // Helper to flatten permissions
  get permissions(): string[] {
    return this.roles.flatMap(r => r.permissions.map(p => p.slug));
  }
}
```

#### Role Entity
```typescript
@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., 'admin', 'manager'

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (perm) => perm.roles)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
```

#### Client Entity
```typescript
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  taxId: string;

  @OneToMany(() => Invoice, (invoice) => invoice.client)
  invoices: Invoice[];
}
```

#### Invoice Entity
```typescript
@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.invoices)
  client: Client;

  @Column('decimal')
  amount: number;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## Backend Implementation (NestJS)

### Auth Service (Login with Permissions)

```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(user: User) {
    const payload = { 
      username: user.email, 
      sub: user.id,
      permissions: user.permissions // Flattened perms
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### RBAC Guard (TypeORM Compatible)

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPerms) return true;

    const { user } = context.switchToHttp().getRequest();
    // Assuming the JWT strategy attaches user with permissions to request
    return requiredPerms.every((perm) => user.permissions.includes(perm));
  }
}
```

---

## Frontend Implementation (Next.js 16 + Zustand)

### Zustand Authentication Store
Replace React Context with a global Zustand store for user state.

`stores/useAuthStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  can: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      
      login: (token, user) => set({ token, user }),
      
      logout: () => set({ token: null, user: null }),
      
      can: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) ?? false;
      },
    }),
    {
      name: 'auth-storage', // persist to localStorage
    }
  )
);
```

### Protected Component Example

`components/ProtectedInvoiceButton.tsx`
```typescript
'use client';
import { useAuthStore } from '@/stores/useAuthStore';

export function CreateInvoiceButton() {
  const canCreate = useAuthStore((state) => state.can('invoices:create'));

  if (!canCreate) return null;

  return (
    <button className="bg-blue-600 px-4 py-2 rounded text-white">
      Create New Invoice
    </button>
  );
}
```

### ERP Client Store
Managing ERP data with Zustand.

`stores/useClientStore.ts`
```typescript
import { create } from 'zustand';
import { api } from '@/lib/api';

interface Client { id: string; name: string; }

interface ClientState {
  clients: Client[];
  loading: boolean;
  fetchClients: () => Promise<void>;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  loading: false,
  fetchClients: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/clients');
      set({ clients: data });
    } finally {
      set({ loading: false });
    }
  }
}));
```

---

## Setup & Running

Using `pnpm` is required.

### 1. Install Dependencies

```bash
# Backend
cd backend
pnpm install
pnpm add @nestjs/typeorm typeorm pg

# Frontend
cd frontend
pnpm install
pnpm add zustand @types/node -D
```

### 2. Run Database

```bash
docker run --name rbacerp-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### 3. Start Services

```bash
# Backend
cd backend
pnpm start:dev

# Frontend
cd frontend
pnpm dev
```
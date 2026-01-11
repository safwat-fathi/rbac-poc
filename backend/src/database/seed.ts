import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Permission } from '../rbac/entities/permission.entity';
import { Role } from '../rbac/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { PERMISSIONS, ACTIONS, RESOURCES } from '../shared/permissions';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Seeding database...');

  const permRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);

  // 1. Seed Permissions
  const allPermissions = Object.values(PERMISSIONS);
  const savedPermissions: Record<string, Permission> = {};

  for (const slug of allPermissions) {
    let perm = await permRepo.findOne({ where: { slug } });
    if (!perm) {
      perm = permRepo.create({
        slug,
        description: `Permission to ${slug}`,
      });
      await permRepo.save(perm);
    }
    savedPermissions[slug] = perm;
  }
  console.log('✅ Permissions seeded');

  // 2. Seed Roles
  const rolesConfig = {
    admin: allPermissions, // Admin gets everything
    manager: [
      PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_CREATE, PERMISSIONS.CLIENTS_UPDATE,
      PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_CREATE, PERMISSIONS.INVOICES_APPROVE,
      PERMISSIONS.PURCHASES_READ, PERMISSIONS.PURCHASES_APPROVE
    ],
    accountant: [
      PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_CREATE,
      PERMISSIONS.PURCHASES_READ, PERMISSIONS.PURCHASES_CREATE
    ],
    sales: [
        PERMISSIONS.CLIENTS_READ, PERMISSIONS.CLIENTS_CREATE,
        PERMISSIONS.INVOICES_READ, PERMISSIONS.INVOICES_CREATE
    ]
  };

  for (const [roleName, permissions] of Object.entries(rolesConfig)) {
    let role = await roleRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });
    if (!role) {
      role = roleRepo.create({ name: roleName });
    }
    
    // Update permissions
    role.permissions = permissions.map(slug => savedPermissions[slug]);
    await roleRepo.save(role);
  }
  console.log('✅ Roles seeded');

  // 3. Seed Users
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const usersConfig = [
    { email: 'admin@erp.com', name: 'Admin User', roles: ['admin'] },
    { email: 'manager@erp.com', name: 'Manager User', roles: ['manager'] },
    { email: 'accountant@erp.com', name: 'Accountant User', roles: ['accountant'] },
    { email: 'sales@erp.com', name: 'Sales User', roles: ['sales'] },
  ];

  for (const u of usersConfig) {
    let user = await userRepo.findOne({ where: { email: u.email } });
    if (!user) {
      user = userRepo.create({
        email: u.email,
        name: u.name,
        passwordHash,
      });
    }
    
    // Assign roles
    const userRoles: Role[] = [];
    for (const rName of u.roles) {
      const role = await roleRepo.findOne({ where: { name: rName } });
      if (role) userRoles.push(role);
    }
    user.roles = userRoles;
    await userRepo.save(user);
  }
  console.log('✅ Users seeded');

  await app.close();
}

bootstrap();

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const permission_entity_1 = require("../rbac/entities/permission.entity");
const role_entity_1 = require("../rbac/entities/role.entity");
const user_entity_1 = require("../users/entities/user.entity");
const permissions_1 = require("../shared/permissions");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    console.log('🌱 Seeding database...');
    const permRepo = dataSource.getRepository(permission_entity_1.Permission);
    const roleRepo = dataSource.getRepository(role_entity_1.Role);
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const allPermissions = Object.values(permissions_1.PERMISSIONS);
    const savedPermissions = {};
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
    const rolesConfig = {
        admin: allPermissions,
        manager: [
            permissions_1.PERMISSIONS.CLIENTS_READ, permissions_1.PERMISSIONS.CLIENTS_CREATE, permissions_1.PERMISSIONS.CLIENTS_UPDATE,
            permissions_1.PERMISSIONS.INVOICES_READ, permissions_1.PERMISSIONS.INVOICES_CREATE, permissions_1.PERMISSIONS.INVOICES_APPROVE,
            permissions_1.PERMISSIONS.PURCHASES_READ, permissions_1.PERMISSIONS.PURCHASES_APPROVE
        ],
        accountant: [
            permissions_1.PERMISSIONS.INVOICES_READ, permissions_1.PERMISSIONS.INVOICES_CREATE,
            permissions_1.PERMISSIONS.PURCHASES_READ, permissions_1.PERMISSIONS.PURCHASES_CREATE
        ],
        sales: [
            permissions_1.PERMISSIONS.CLIENTS_READ, permissions_1.PERMISSIONS.CLIENTS_CREATE,
            permissions_1.PERMISSIONS.INVOICES_READ, permissions_1.PERMISSIONS.INVOICES_CREATE
        ]
    };
    for (const [roleName, permissions] of Object.entries(rolesConfig)) {
        let role = await roleRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });
        if (!role) {
            role = roleRepo.create({ name: roleName });
        }
        role.permissions = permissions.map(slug => savedPermissions[slug]);
        await roleRepo.save(role);
    }
    console.log('✅ Roles seeded');
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
        const userRoles = [];
        for (const rName of u.roles) {
            const role = await roleRepo.findOne({ where: { name: rName } });
            if (role)
                userRoles.push(role);
        }
        user.roles = userRoles;
        await userRepo.save(user);
    }
    console.log('✅ Users seeded');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map
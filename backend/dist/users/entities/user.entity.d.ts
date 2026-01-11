import { Role } from '../../rbac/entities/role.entity';
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
    get permissions(): string[];
}

import { Role } from './role.entity';
export declare class Permission {
    id: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    roles: Role[];
}

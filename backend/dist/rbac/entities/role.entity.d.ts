import { User } from '../../users/entities/user.entity';
import { Permission } from './permission.entity';
export declare class Role {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users: User[];
    permissions: Permission[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../rbac/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  // Helper helper to get flattened permissions, 
  // though typically we resolve this at the service level or JWT generation time
  get permissions(): string[] {
    if (!this.roles) return [];
    const perms = new Set<string>();
    this.roles.forEach(role => {
        if(role.permissions) {
            role.permissions.forEach(p => perms.add(p.slug));
        }
    });
    return Array.from(perms);
  }
}

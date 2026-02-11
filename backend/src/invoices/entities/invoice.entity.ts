import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.invoices)
  client: Client;
  
  @Column()
  clientId: string;

  @Column('decimal')
  amount: number;

  @Column({ default: 'DRAFT' })
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

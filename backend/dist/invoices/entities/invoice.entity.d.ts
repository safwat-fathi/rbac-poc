import { Client } from '../../clients/entities/client.entity';
export declare class Invoice {
    id: string;
    client: Client;
    clientId: string;
    amount: number;
    status: 'DRAFT' | 'PENDING' | 'PAID' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
}

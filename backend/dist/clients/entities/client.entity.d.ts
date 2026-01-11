import { Invoice } from '../../invoices/entities/invoice.entity';
export declare class Client {
    id: string;
    name: string;
    taxId: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    invoices: Invoice[];
}

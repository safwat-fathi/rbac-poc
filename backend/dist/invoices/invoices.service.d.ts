import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
export declare class InvoicesService {
    private invoicesRepository;
    constructor(invoicesRepository: Repository<Invoice>);
    create(createInvoiceDto: any): Promise<Invoice[]>;
    findAll(): Promise<Invoice[]>;
    findOne(id: string): Promise<Invoice | null>;
    update(id: string, updateInvoiceDto: any): Promise<Invoice | null>;
    approve(id: string): Promise<Invoice | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

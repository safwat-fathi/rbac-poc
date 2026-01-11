import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoicesService;
    constructor(invoicesService: InvoicesService);
    create(createInvoiceDto: any): Promise<import("./entities/invoice.entity").Invoice[]>;
    findAll(): Promise<import("./entities/invoice.entity").Invoice[]>;
    findOne(id: string): Promise<import("./entities/invoice.entity").Invoice | null>;
    update(id: string, updateInvoiceDto: any): Promise<import("./entities/invoice.entity").Invoice | null>;
    approve(id: string): Promise<import("./entities/invoice.entity").Invoice | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

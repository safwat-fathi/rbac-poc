import { PurchasesService } from './purchases.service';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(createPurchaseDto: any): Promise<import("./entities/purchase.entity").Purchase[]>;
    findAll(): Promise<import("./entities/purchase.entity").Purchase[]>;
    findOne(id: string): Promise<import("./entities/purchase.entity").Purchase | null>;
    approve(id: string): Promise<import("./entities/purchase.entity").Purchase | null>;
}

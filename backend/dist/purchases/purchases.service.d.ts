import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
export declare class PurchasesService {
    private purchasesRepository;
    constructor(purchasesRepository: Repository<Purchase>);
    create(createPurchaseDto: any): Promise<Purchase[]>;
    findAll(): Promise<Purchase[]>;
    findOne(id: string): Promise<Purchase | null>;
    update(id: string, updatePurchaseDto: any): Promise<Purchase | null>;
    approve(id: string): Promise<Purchase | null>;
}

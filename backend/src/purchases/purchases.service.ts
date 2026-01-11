import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
  ) {}

  create(createPurchaseDto: any) {
    const purchase = this.purchasesRepository.create(createPurchaseDto);
    return this.purchasesRepository.save(purchase);
  }

  findAll() {
    return this.purchasesRepository.find();
  }

  findOne(id: string) {
    return this.purchasesRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePurchaseDto: any) {
     await this.purchasesRepository.update(id, updatePurchaseDto);
     return this.findOne(id);
  }

  async approve(id: string) {
    await this.purchasesRepository.update(id, { status: 'APPROVED' });
    return this.findOne(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  create(createInvoiceDto: any) {
    const invoice = this.invoicesRepository.create(createInvoiceDto);
    return this.invoicesRepository.save(invoice);
  }

  findAll() {
    return this.invoicesRepository.find({ relations: ['client'] });
  }

  findOne(id: string) {
    return this.invoicesRepository.findOne({ where: { id }, relations: ['client'] });
  }

  async update(id: string, updateInvoiceDto: any) {
    await this.invoicesRepository.update(id, updateInvoiceDto);
    return this.findOne(id);
  }
  
  async approve(id: string) {
      await this.invoicesRepository.update(id, { status: 'PENDING' }); // Or 'PAID' or whatever flow
      return this.findOne(id);
  }

  remove(id: string) {
    return this.invoicesRepository.delete(id);
  }
}

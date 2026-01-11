import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  create(createClientDto: any) {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  findAll() {
    return this.clientsRepository.find();
  }

  findOne(id: string) {
    return this.clientsRepository.findOne({ where: { id }, relations: ['invoices'] });
  }

  async update(id: string, updateClientDto: any) {
    await this.clientsRepository.update(id, updateClientDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.clientsRepository.delete(id);
  }
}

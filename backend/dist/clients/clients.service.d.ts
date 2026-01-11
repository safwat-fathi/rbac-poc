import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
export declare class ClientsService {
    private clientsRepository;
    constructor(clientsRepository: Repository<Client>);
    create(createClientDto: any): Promise<Client[]>;
    findAll(): Promise<Client[]>;
    findOne(id: string): Promise<Client | null>;
    update(id: string, updateClientDto: any): Promise<Client | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

import { ClientsService } from './clients.service';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: any): Promise<import("./entities/client.entity").Client[]>;
    findAll(): Promise<import("./entities/client.entity").Client[]>;
    findOne(id: string): Promise<import("./entities/client.entity").Client | null>;
    update(id: string, updateClientDto: any): Promise<import("./entities/client.entity").Client | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
}

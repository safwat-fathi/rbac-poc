import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../shared/permissions';

@Controller('clients')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.CLIENTS_CREATE)
  create(@Body() createClientDto: any) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @RequirePermissions(PERMISSIONS.CLIENTS_READ)
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.CLIENTS_READ)
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.CLIENTS_UPDATE)
  update(@Param('id') id: string, @Body() updateClientDto: any) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.CLIENTS_DELETE)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../shared/permissions';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.INVOICES_CREATE)
  create(@Body() createInvoiceDto: any) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @RequirePermissions(PERMISSIONS.INVOICES_READ)
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.INVOICES_READ)
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.INVOICES_UPDATE)
  update(@Param('id') id: string, @Body() updateInvoiceDto: any) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }
  
  @Patch(':id/approve')
  @RequirePermissions(PERMISSIONS.INVOICES_APPROVE)
  approve(@Param('id') id: string) {
    return this.invoicesService.approve(id);
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.INVOICES_DELETE)
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}

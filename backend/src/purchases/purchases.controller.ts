import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '@nestjs/passport';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PERMISSIONS } from '../shared/permissions';

@Controller('purchases')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.PURCHASES_CREATE)
  create(@Body() createPurchaseDto: any) {
    return this.purchasesService.create(createPurchaseDto);
  }

  @Get()
  @RequirePermissions(PERMISSIONS.PURCHASES_READ)
  findAll() {
    return this.purchasesService.findAll();
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.PURCHASES_READ)
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Patch(':id/approve')
  @RequirePermissions(PERMISSIONS.PURCHASES_APPROVE)
  approve(@Param('id') id: string) {
    return this.purchasesService.approve(id);
  }
}

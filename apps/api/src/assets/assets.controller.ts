import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Post()
  create(@Body() body: Record<string, any>) {
    return this.assetsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.assetsService.update(Number(id), body);
  }
}

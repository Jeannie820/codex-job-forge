import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Post()
  create(@Body() body: Record<string, any>) {
    return this.applicationsService.create(body);
  }
}

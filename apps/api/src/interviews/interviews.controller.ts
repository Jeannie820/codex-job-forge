import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  findAll() {
    return this.interviewsService.findAll();
  }

  @Post()
  create(@Body() body: Record<string, any>) {
    return this.interviewsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.interviewsService.update(Number(id), body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.interviewsService.updateStatus(Number(id), body.status);
  }

  @Patch(':id/preparation')
  togglePreparation(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.interviewsService.togglePreparation(Number(id), body.kind, body.item);
  }
}

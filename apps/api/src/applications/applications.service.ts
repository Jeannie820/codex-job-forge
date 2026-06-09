import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.application.findMany({ orderBy: [{ date: 'desc' }, { id: 'desc' }] });
  }

  async create(body: Record<string, any>) {
    const jobId = body.jobId ? Number(body.jobId) : null;
    const job = jobId ? await this.prisma.job.findUnique({ where: { id: jobId } }) : null;

    return this.prisma.application.create({
      data: {
        jobId,
        company: job?.company ?? body.company ?? '',
        title: job?.title ?? body.title ?? '',
        channel: body.channel ?? '未填写',
        resume: body.resume ?? '未填写',
        date: body.date ?? new Date().toISOString().slice(0, 10),
        response: body.response ? `${body.response} 小时` : body.responseText ?? '等待中',
        status: body.status ?? 'submitted',
        description: body.note ?? body.description ?? '暂无备注',
        alert: body.alert ?? null
      }
    });
  }
}

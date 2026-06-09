import { Injectable, NotFoundException } from '@nestjs/common';
import { stringifyArray, parseJsonArray } from '../common/json';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const jobs = await this.prisma.job.findMany({ orderBy: { id: 'asc' } });
    return jobs.map((job) => this.toDto(job));
  }

  async create(body: Record<string, any>) {
    const job = await this.prisma.job.create({
      data: {
        title: body.title,
        company: body.company,
        location: body.location ?? '',
        salary: body.salary ?? '',
        source: body.source ?? '',
        status: body.status ?? 'saved',
        match: Number(body.match ?? 70),
        requirementsJson: stringifyArray(body.requirements),
        description: body.description ?? '',
        note: body.note ?? '',
        appliedAt: body.appliedAt ?? new Date().toISOString().slice(0, 10)
      }
    });

    return this.toDto(job);
  }

  async update(id: number, body: Record<string, any>) {
    await this.ensureExists(id);
    const job = await this.prisma.job.update({
      where: { id },
      data: {
        title: body.title,
        company: body.company,
        location: body.location,
        salary: body.salary,
        source: body.source,
        status: body.status,
        match: body.match === undefined ? undefined : Number(body.match),
        requirementsJson: body.requirements === undefined ? undefined : stringifyArray(body.requirements),
        description: body.description,
        note: body.note,
        appliedAt: body.appliedAt
      }
    });

    return this.toDto(job);
  }

  async updateStatus(id: number, status: string) {
    await this.ensureExists(id);
    const job = await this.prisma.job.update({ where: { id }, data: { status } });
    return this.toDto(job);
  }

  private async ensureExists(id: number) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
  }

  private toDto(job: any) {
    return {
      ...job,
      requirements: parseJsonArray<string>(job.requirementsJson),
      requirementsJson: undefined
    };
  }
}

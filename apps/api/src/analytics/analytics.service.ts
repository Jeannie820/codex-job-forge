import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [jobs, applications, interviews, assets, offers] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.application.count(),
      this.prisma.interview.count(),
      this.prisma.asset.count(),
      this.prisma.application.count({ where: { status: 'offer' } })
    ]);

    return {
      jobs,
      applications,
      interviews,
      assets,
      offerRate: applications ? Math.round((offers / applications) * 1000) / 10 : 0
    };
  }

  async funnel() {
    const statuses = [
      'submitted',
      'viewed',
      'contacted',
      'interviewing',
      'offer',
      'rejected'
    ];
    const rows = await Promise.all(
      statuses.map(async (status) => ({
        status,
        count: await this.prisma.application.count({ where: { status } })
      }))
    );

    return {
      total: rows.reduce((sum, row) => sum + row.count, 0),
      rows
    };
  }
}

import { Module } from '@nestjs/common';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { AssetsModule } from './assets/assets.module';
import { JobsModule } from './jobs/jobs.module';
import { PrismaModule } from './prisma/prisma.module';
import { InterviewsModule } from './interviews/interviews.module';

@Module({
  imports: [PrismaModule, JobsModule, ApplicationsModule, InterviewsModule, AssetsModule, AnalyticsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

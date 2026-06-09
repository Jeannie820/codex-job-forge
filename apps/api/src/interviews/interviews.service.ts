import { Injectable, NotFoundException } from '@nestjs/common';
import { parseJsonArray, stringifyArray } from '../common/json';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const interviews = await this.prisma.interview.findMany({
      orderBy: [{ interviewAt: 'asc' }, { id: 'asc' }]
    });
    return interviews.map((interview) => this.toDto(interview));
  }

  async create(body: Record<string, any>) {
    const jobId = body.jobId ? Number(body.jobId) : null;
    const job = jobId ? await this.prisma.job.findUnique({ where: { id: jobId } }) : null;
    const round = Number(body.round ?? 1);
    const status = body.status ?? 'notStarted';

    const interview = await this.prisma.interview.create({
      data: {
        jobId,
        interviewAt: body.interviewAt,
        type: body.type ?? 'phone',
        status,
        round,
        title: job ? `${job.title} · 第 ${round} 轮` : body.title ?? `第 ${round} 轮面试`,
        company: job?.company ?? body.company ?? '',
        location: job?.location ?? body.location ?? '',
        score: status === 'done' ? Number(body.reviewScore ?? body.score ?? 85) : null,
        companyResearch: body.companyResearch ?? '',
        roleMatch: body.roleMatch ?? '',
        questions: body.questions ?? '',
        projectStories: body.projectStories ?? '',
        preparedQuestionsJson: stringifyArray(body.preparedQuestions),
        preparedProjectStoriesJson: stringifyArray(body.preparedProjectStories),
        usedAssetIdsJson: stringifyArray(body.usedAssetIds),
        strengths: body.strengths ?? '',
        improvements: body.improvements ?? '',
        followUp: body.followUp ?? ''
      }
    });

    return this.toDto(interview);
  }

  async update(id: number, body: Record<string, any>) {
    const existing = await this.prisma.interview.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Interview not found');

    const jobId = body.jobId ? Number(body.jobId) : existing.jobId;
    const job = jobId ? await this.prisma.job.findUnique({ where: { id: jobId } }) : null;
    const round = Number(body.round ?? existing.round);
    const status = body.status ?? existing.status;

    const interview = await this.prisma.interview.update({
      where: { id },
      data: {
        jobId,
        interviewAt: body.interviewAt,
        type: body.type,
        status,
        round,
        title: job ? `${job.title} · 第 ${round} 轮` : body.title,
        company: job?.company ?? body.company,
        location: job?.location ?? body.location,
        score: status === 'done' ? Number(body.reviewScore ?? body.score ?? existing.score ?? 85) : null,
        companyResearch: body.companyResearch,
        roleMatch: body.roleMatch,
        questions: body.questions,
        projectStories: body.projectStories,
        preparedQuestionsJson:
          body.preparedQuestions === undefined ? undefined : stringifyArray(body.preparedQuestions),
        preparedProjectStoriesJson:
          body.preparedProjectStories === undefined ? undefined : stringifyArray(body.preparedProjectStories),
        usedAssetIdsJson: body.usedAssetIds === undefined ? undefined : stringifyArray(body.usedAssetIds),
        strengths: body.strengths,
        improvements: body.improvements,
        followUp: body.followUp
      }
    });

    return this.toDto(interview);
  }

  async updateStatus(id: number, status: string) {
    const existing = await this.prisma.interview.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Interview not found');

    const interview = await this.prisma.interview.update({
      where: { id },
      data: {
        status,
        score: status === 'done' ? existing.score ?? 85 : existing.score
      }
    });
    return this.toDto(interview);
  }

  async togglePreparation(id: number, kind: string, item: string) {
    const existing = await this.prisma.interview.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Interview not found');

    const field = kind === 'projectStories' ? 'preparedProjectStoriesJson' : 'preparedQuestionsJson';
    const current = parseJsonArray<string>(String((existing as Record<string, unknown>)[field] ?? '[]'));
    const next = current.includes(item) ? current.filter((value) => value !== item) : [...current, item];
    const interview = await this.prisma.interview.update({
      where: { id },
      data: { [field]: stringifyArray(next) }
    });

    return this.toDto(interview);
  }

  private toDto(interview: any) {
    return {
      id: interview.id,
      jobId: interview.jobId,
      interviewAt: interview.interviewAt,
      type: interview.type,
      status: interview.status,
      round: interview.round,
      title: interview.title,
      company: interview.company,
      location: interview.location,
      score: interview.score ?? undefined,
      companyResearch: interview.companyResearch,
      roleMatch: interview.roleMatch,
      questions: interview.questions,
      projectStories: interview.projectStories,
      preparedQuestions: parseJsonArray<string>(interview.preparedQuestionsJson),
      preparedProjectStories: parseJsonArray<string>(interview.preparedProjectStoriesJson),
      usedAssetIds: parseJsonArray<number>(interview.usedAssetIdsJson),
      strengths: interview.strengths,
      improvements: interview.improvements,
      followUp: interview.followUp
    };
  }
}

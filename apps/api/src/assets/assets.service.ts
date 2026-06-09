import { Injectable, NotFoundException } from '@nestjs/common';
import { parseJsonArray, stringifyArray } from '../common/json';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const assets = await this.prisma.asset.findMany({ orderBy: { id: 'asc' } });
    return assets.map((asset) => this.toDto(asset));
  }

  async create(body: Record<string, any>) {
    const today = new Date().toISOString().slice(0, 10);
    const asset = await this.prisma.asset.create({
      data: {
        title: body.title,
        type: body.type ?? 'resume',
        tagsJson: stringifyArray(body.tags),
        content: body.content ?? '',
        updatedAtText: today,
        createdAtText: today
      }
    });

    return this.toDto(asset);
  }

  async update(id: number, body: Record<string, any>) {
    const existing = await this.prisma.asset.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Asset not found');

    const asset = await this.prisma.asset.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        tagsJson: body.tags === undefined ? undefined : stringifyArray(body.tags),
        usage: body.usage === undefined ? undefined : Number(body.usage),
        content: body.content,
        updatedAtText: body.content === undefined ? body.updatedAt : new Date().toISOString().slice(0, 10)
      }
    });

    return this.toDto(asset);
  }

  private toDto(asset: any) {
    return {
      id: asset.id,
      title: asset.title,
      type: asset.type,
      tags: parseJsonArray<string>(asset.tagsJson),
      usage: asset.usage,
      updatedAt: asset.updatedAtText,
      createdAt: asset.createdAtText,
      content: asset.content
    };
  }
}

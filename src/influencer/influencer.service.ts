import { Injectable } from '@nestjs/common';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class InfluencerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateInfluencerDto) {
    const { name, accounts } = payload;
    const data = await this.prisma.influencer.create({
      data: { name, account: { createMany: { data: accounts } } },
      include: { account: true },
    });
    return data;
  }

  async findAll() {
    const data = await this.prisma.influencer.findMany({});
    return data;
  }

  async findOne(id: string) {
    const data = await this.prisma.influencer.findUnique({
      where: { id },
      include: { account: true },
    });
    return data;
  }
}

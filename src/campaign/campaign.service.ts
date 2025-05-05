import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCampaignDto } from './dto/campaign-create.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateCampaignDto) {
    return this.prisma.campaign.create({ data: payload });
  }

  findAll() {
    return this.prisma.campaign.findMany({});
  }

  async findOne(id: string) {
    const data = await this.prisma.campaign.findUnique({
      where: { id },
      include: { campaignAccount: { include: { account: true } } },
    });

    const normalize = {
      ...data,
      campaignAccount: data.campaignAccount.map((item) => item.account),
    };

    return normalize;
  }

  addAccount(id: string, accountIds: string[]) {
    return this.prisma.campaignAccount.createMany({
      data: accountIds.map((accountId) => ({ campaignId: id, accountId })),
      skipDuplicates: true,
    });
  }
}

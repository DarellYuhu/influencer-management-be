import { Injectable, NotFoundException } from '@nestjs/common';
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
      include: {
        campaignAccount: {
          include: { account: true },
        },
      },
    });
    const statistic = await this.prisma.statistic.aggregate({
      _sum: {
        comment: true,
        download: true,
        forward: true,
        like: true,
        play: true,
        share: true,
      },
      where: {
        content: {
          campaignAccount: {
            campaignId: id,
          },
        },
      },
    });
    const normalize = {
      ...data,
      campaignAccount: data?.campaignAccount.map((item) => item.account),
      statistic: statistic._sum,
    };
    return normalize;
  }

  addAccount(id: string, accountIds: string[]) {
    return this.prisma.campaignAccount.createMany({
      data: accountIds.map((accountId) => ({ campaignId: id, accountId })),
      skipDuplicates: true,
    });
  }

  async campAcctOveralStats(campaignId: string, accountId: string) {
    const account = await this.prisma.account
      .findUniqueOrThrow({
        where: { id: accountId },
        select: { followers: true },
      })
      .catch(() => {
        throw new NotFoundException('Account not found');
      });
    const statistic = await this.prisma.statistic.aggregate({
      where: {
        content: {
          campaignAccount: {
            campaignId,
            accountId,
          },
        },
      },
      _avg: {
        comment: true,
        download: true,
        forward: true,
        like: true,
        play: true,
        share: true,
      },
    });
    const performance = await this.prisma.content.aggregate({
      where: {
        campaignAccount: {
          campaignId,
          accountId,
        },
      },
      _avg: {
        prodComplexity: true,
        messageEmbeding: true,
      },
    });
    return {
      ...statistic._avg,
      ...performance._avg,
      playToFollowers: statistic._avg.play! / account.followers,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Platform } from 'src/enums';
import { UpdateAccountDto } from './dto/update-account.dto';
import * as Minio from 'minio';
import { MINIO_CLIENT } from 'src/core/minio/minio.module';
import { CreateAccountsDto } from './dto/create-accounts.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject(MINIO_CLIENT) private readonly minio: Minio.Client,
    private readonly prisma: PrismaService,
  ) {}

  findOne(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  update(id: string, payload: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { id },
      data: payload,
    });
  }

  createMany(payload: CreateAccountsDto) {
    return this.prisma.account.createManyAndReturn({
      data: payload.accounts.map((acc) => ({
        ...acc,
        influencerId: payload.influencerId,
      })),
      skipDuplicates: true,
    });
  }

  async findAll(query: Query) {
    const filter: Prisma.AccountWhereInput = {};
    if (query.platform) filter.platform = query.platform;
    if (query.nicheId) {
      filter.accountNiche = { some: { nicheId: +query.nicheId } };
    }
    if (query.followerRange) {
      switch (query.followerRange) {
        case '1':
          filter.followers = { gte: 0, lte: 10000 };
          break;
        case '2':
          filter.followers = { gte: 10000, lte: 100000 };
          break;
        case '3':
          filter.followers = { gte: 100000, lte: 1000000 };
          break;
        case '4':
          filter.followers = { gte: 1000000 };
          break;
      }
    }
    if (query.search) {
      filter.username = { contains: query.search, mode: 'insensitive' };
    }
    const accounts = await this.prisma.account.findMany({
      where: filter,
      include: {
        avatar: true,
        accountNiche: { select: { niche: true } },
        campaignAccount: {
          select: { content: { include: { statistic: true } } },
        },
      },
    });
    const normalize = await Promise.all(
      accounts.map(
        async ({ accountNiche, avatar, campaignAccount, ...item }) => {
          const content = campaignAccount.flatMap((item) => item.content);
          const performance = this.calculateAverages(content, item.followers);
          return {
            ...item,
            performance,
            avatar: avatar
              ? await this.minio.presignedUrl('GET', 'files', avatar.name)
              : null,
            niches: accountNiche.map((item) => item.niche.name),
          };
        },
      ),
    );
    return normalize;
  }

  addNiche(id: string, nicheIds: number[]) {
    return this.prisma.accountNiche.createMany({
      data: nicheIds.map((nicheId) => ({ accountId: id, nicheId })),
    });
  }

  addCampaign(id: string, campaignId: string[]) {
    return this.prisma.campaignAccount.createMany({
      data: campaignId.map((campaignId) => ({ accountId: id, campaignId })),
      skipDuplicates: true,
    });
  }

  private calculateAverages(
    flattened: {
      prodComplexity: number | null;
      messageEmbeding: number | null;
      statistic: { play: number } | null;
    }[],
    followers: number,
  ) {
    const {
      totalProdComplexity,
      countProdComplexity,
      totalMessageEmbedding,
      countMessageEmbedding,
      totalPlay,
    } = flattened.reduce(
      (acc, item) => {
        const { prodComplexity, messageEmbeding, statistic } = item;

        if (prodComplexity !== null) {
          acc.totalProdComplexity += prodComplexity;
          acc.countProdComplexity++;
        }

        if (messageEmbeding !== null) {
          acc.totalMessageEmbedding += messageEmbeding;
          acc.countMessageEmbedding++;
        }

        acc.totalPlay += statistic!.play;

        return acc;
      },
      {
        totalProdComplexity: 0,
        countProdComplexity: 0,
        totalMessageEmbedding: 0,
        countMessageEmbedding: 0,
        totalPlay: 0,
      },
    );

    return {
      prodComplexity: countProdComplexity
        ? totalProdComplexity / countProdComplexity
        : 0,
      messageEmbeding: countMessageEmbedding
        ? totalMessageEmbedding / countMessageEmbedding
        : 0,
      playToFollowers: followers > 0 ? totalPlay / followers : 0,
    };
  }
}

type Query = {
  platform?: Platform;
  nicheId?: string;
  followerRange?: string;
  search?: string;
};

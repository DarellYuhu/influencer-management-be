import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Platform } from 'src/enums';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  findAll(platform?: Platform) {
    const filter: Prisma.AccountWhereInput = {};
    if (platform) filter.platform = platform;
    return this.prisma.account.findMany({ where: filter });
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
}

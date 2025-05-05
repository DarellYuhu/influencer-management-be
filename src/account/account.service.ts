import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Platform } from 'src/enums';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(platform?: Platform) {
    const filter: Prisma.AccountWhereInput = {};
    if (platform) filter.platform = platform;
    return this.prisma.account.findMany({ where: filter });
  }
}

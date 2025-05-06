import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateNicheDto } from './dto/create-niche.dto';

@Injectable()
export class NicheService {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.niche.findMany({});
  }

  createMany(payload: CreateNicheDto) {
    return this.prisma.niche.createMany({
      data: payload.name.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }
}

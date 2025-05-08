import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(username: string) {
    return this.prisma.user.findUniqueOrThrow({ where: { username } });
  }

  create(payload: CreateUserDto) {
    const hash = bcrypt.hashSync(payload.password, 10);
    return this.prisma.user.create({
      data: { ...payload, password: hash },
      omit: { password: true },
    });
  }
}

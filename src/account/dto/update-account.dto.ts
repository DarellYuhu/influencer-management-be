import { IsOptional, IsString } from 'class-validator';
import { Prisma } from 'generated/prisma';

export class UpdateAccountDto implements Prisma.AccountUpdateInput {
  @IsString()
  @IsOptional()
  username?: string;
}

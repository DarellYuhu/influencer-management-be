import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { Prisma } from 'generated/prisma';
import { Platform } from 'src/enums';

export class Account implements Prisma.AccountCreateManyInfluencerInput {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(5)
  brandingLvl: number;

  @IsNumber()
  @IsNotEmpty()
  followers: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(Platform)
  platform: Platform;
}

export class CreateInfluencerDto implements Prisma.InfluencerCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Account)
  accounts: Account[];
}

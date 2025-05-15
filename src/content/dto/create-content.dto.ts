import { ApiHideProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Prisma } from 'generated/prisma';

export class Statistic
  implements Prisma.StatisticUncheckedCreateWithoutContentInput
{
  @IsNumber()
  comment: number;

  @IsNumber()
  download: number;

  @IsNumber()
  forward: number;

  @IsNumber()
  like: number;

  @IsNumber()
  play: number;

  @IsNumber()
  share: number;
}

export class CreateManualDto
  implements
    Omit<Prisma.ContentUncheckedCreateInput, 'campAcctId' | 'statistic' | 'id'>
{
  @IsDateString()
  createTime: string | Date;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsOptional()
  coverId?: number | null;

  @IsNumber()
  @IsOptional()
  duration?: number | null;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Type(() => Statistic)
  @IsOptional()
  @ValidateNested()
  statistic?: Statistic;
}

export class CreateContentDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ArrayNotEmpty()
  @IsOptional()
  urls?: string[];

  @IsArray()
  @Type(() => CreateManualDto)
  @ValidateNested({ each: true })
  @IsOptional()
  manualData?: CreateManualDto[];

  // XOR validation: Only one of 'urls' or 'manualData' must be provided
  @ApiHideProperty()
  @ValidateIf((o) => (!o.urls && !o.manualData) || (o.urls && o.manualData))
  @IsDefined({
    message: 'Provide either urls or manualData, and only one of them',
  })
  // Dummy field for validation logic only
  protected readonly exactlyOne: undefined;

  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;
}

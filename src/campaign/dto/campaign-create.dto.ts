import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from 'generated/prisma';
import { Platform } from 'src/enums';

export class CreateCampaignDto implements Prisma.CampaignCreateInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  operationDate: string | Date;

  @IsEnum(Platform)
  @IsNotEmpty()
  platform: Platform;
}

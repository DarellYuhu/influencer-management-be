import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateContentDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @ArrayNotEmpty()
  urls: string[];

  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;
}

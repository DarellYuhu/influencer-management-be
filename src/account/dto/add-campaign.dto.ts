import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddCampaignDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Type(() => String)
  campaignIds: string[];
}

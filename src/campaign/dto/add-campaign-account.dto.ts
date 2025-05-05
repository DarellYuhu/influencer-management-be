import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddCampaignAccountDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  accountIds: string[];
}

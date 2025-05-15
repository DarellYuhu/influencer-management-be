import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  Account,
  CreateInfluencerDto,
} from 'src/influencer/dto/create-influencer.dto';

export class CreateAccountsDto
  implements Pick<CreateInfluencerDto, 'accounts'>
{
  @IsNotEmpty()
  @IsString()
  influencerId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Account)
  accounts: Account[];
}

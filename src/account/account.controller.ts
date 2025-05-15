import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Platform } from 'src/enums';
import { AddNicheDto } from './dto/add-niche.dto';
import { AddCampaignDto } from './dto/add-campaign.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountsDto } from './dto/create-accounts.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createMany(@Body() payload: CreateAccountsDto) {
    return this.accountService.createMany(payload);
  }

  @Get()
  findAll(
    @Query('platform') platform?: string,
    @Query('nicheId') nicheId?: string,
    @Query('followerRange') followerRange?: string,
    @Query('search') search?: string,
  ) {
    const query = {
      platform: platform as Platform,
      nicheId,
      followerRange,
      search,
    };
    return this.accountService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateAccountDto) {
    return this.accountService.update(id, payload);
  }

  @Post(':id/niches')
  addNiche(@Param('id') id: string, @Body() payload: AddNicheDto) {
    return this.accountService.addNiche(id, payload.nicheIds);
  }

  @Post(':id/campaigns')
  addCampaign(@Param('id') id: string, @Body() payload: AddCampaignDto) {
    return this.accountService.addCampaign(id, payload.campaignIds);
  }
}

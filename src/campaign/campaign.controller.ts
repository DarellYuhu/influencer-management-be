import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/campaign-create.dto';
import { AddCampaignAccountDto } from './dto/add-campaign-account.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  async create(@Body() payload: CreateCampaignDto) {
    const data = await this.campaignService.create(payload);
    return data;
  }

  @Get()
  async findAll() {
    const data = await this.campaignService.findAll();
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.campaignService.findOne(id);
    return data;
  }

  @Post(':id/accounts')
  async addAccount(
    @Param('id') id: string,
    @Body() payload: AddCampaignAccountDto,
  ) {
    const data = await this.campaignService.addAccount(id, payload.accountIds);
    return data;
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { CreateInfluencerDto } from './dto/create-influencer.dto';

@Controller('influencers')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post()
  async create(@Body() payload: CreateInfluencerDto) {
    const data = await this.influencerService.create(payload);
    return data;
  }
  @Get()
  async findAll() {
    const data = await this.influencerService.findAll();
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.influencerService.findOne(id);
    return data;
  }
}

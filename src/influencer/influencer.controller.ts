import { Body, Controller, Post } from '@nestjs/common';
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
}

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  findAll(
    @Query('accountId') accountId?: string,
    @Query('campaignId') campaignId?: string,
  ) {
    return this.contentService.findAll(accountId, campaignId);
  }

  @Post()
  createMany(@Body() payload: CreateContentDto) {
    return this.contentService.createMany(payload);
  }
}

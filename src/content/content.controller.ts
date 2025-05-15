import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CONTENT_SCHEMA, ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

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
  createMany(
    @Body() payload: CreateContentDto,
    @Query('schema') schema?: string,
  ) {
    return this.contentService.createMany(
      schema as (typeof CONTENT_SCHEMA)[number],
      payload,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateContentDto) {
    return this.contentService.update(id, payload);
  }
}

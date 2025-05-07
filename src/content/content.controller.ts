import { Body, Controller, Post } from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  createMany(@Body() payload: CreateContentDto) {
    return this.contentService.createMany(payload);
  }
}

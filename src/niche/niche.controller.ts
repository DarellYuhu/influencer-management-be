import { Body, Controller, Get, Post } from '@nestjs/common';
import { NicheService } from './niche.service';
import { CreateNicheDto } from './dto/create-niche.dto';

@Controller('niches')
export class NicheController {
  constructor(private readonly nicheService: NicheService) {}

  @Get()
  findMany() {
    return this.nicheService.findMany();
  }

  @Post()
  createMany(@Body() payload: CreateNicheDto) {
    return this.nicheService.createMany(payload);
  }
}

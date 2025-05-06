import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { Platform } from 'src/enums';
import { AddNicheDto } from './dto/add-niche.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll(@Query('platform') platform?: string) {
    return this.accountService.findAll(platform as Platform);
  }

  @Post(':id/niches')
  addNiche(@Param('id') id: string, @Body() payload: AddNicheDto) {
    return this.accountService.addNiche(id, payload.nicheIds);
  }
}

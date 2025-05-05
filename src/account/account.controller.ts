import { Controller, Get, Query } from '@nestjs/common';
import { AccountService } from './account.service';
import { Platform } from 'src/enums';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll(@Query('platform') platform?: string) {
    return this.accountService.findAll(platform as Platform);
  }
}

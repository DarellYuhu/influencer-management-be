import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { TiktokModule } from 'src/tiktok/tiktok.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [TiktokModule, AccountModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}

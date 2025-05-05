import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { InfluencerModule } from './influencer/influencer.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    PrismaModule,
    InfluencerModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    CampaignModule,
    AccountModule,
  ],
})
export class AppModule {}

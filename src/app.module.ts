import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { InfluencerModule } from './influencer/influencer.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { AccountModule } from './account/account.module';
import { NicheModule } from './niche/niche.module';
import { ContentModule } from './content/content.module';
import { MinioModule } from './core/minio/minio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    PrismaModule,
    InfluencerModule,
    CampaignModule,
    AccountModule,
    NicheModule,
    ContentModule,
    MinioModule,
  ],
})
export class AppModule {}

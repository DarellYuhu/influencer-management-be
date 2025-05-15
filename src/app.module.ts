import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { InfluencerModule } from './influencer/influencer.module';
import { ConfigModule } from '@nestjs/config';
import { CampaignModule } from './campaign/campaign.module';
import { AccountModule } from './account/account.module';
import { NicheModule } from './niche/niche.module';
import { ContentModule } from './content/content.module';
import { MinioModule } from './core/minio/minio.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilsModule } from './core/utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: true,
    }),
    PrismaModule,
    InfluencerModule,
    CampaignModule,
    AccountModule,
    NicheModule,
    ContentModule,
    MinioModule,
    AuthModule,
    UserModule,
    UtilsModule,
  ],
})
export class AppModule {}

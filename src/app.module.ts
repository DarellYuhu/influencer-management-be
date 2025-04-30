import { Module } from '@nestjs/common';
import { PrismaModule } from './core/prisma/prisma.module';
import { InfluencerModule } from './influencer/influencer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    InfluencerModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
  ],
})
export class AppModule {}

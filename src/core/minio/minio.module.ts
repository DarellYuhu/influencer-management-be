import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

export const MINIO_CLIENT = Symbol('MINIO_CLIENT');
const MinioProvider: Provider = {
  provide: MINIO_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    new Minio.Client({
      endPoint: config.get('MINIO_ENDPOINT'),
      port: config.get('MINIO_PORT'),
      accessKey: config.get('MINIO_ACCESS_KEY'),
      secretKey: config.get('MINIO_SECRET_KEY'),
      useSSL: false,
    }),
};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [MinioProvider],
  exports: [MinioProvider],
})
export class MinioModule {}

import { Module } from '@nestjs/common';
import { MinioModule } from 'nestjs-minio-client';
import { MinioClientService } from './minio.service';
import { ACCESSKEY, ENDPOINT, PORT, SECRETKEY } from './config';

@Module({
  imports: [
    MinioModule.register({
      endPoint: ENDPOINT,
      port: PORT,
      useSSL: false,
      accessKey: ACCESSKEY,
      secretKey: SECRETKEY,
    }),
  ],
  providers: [MinioClientService],
  exports: [MinioClientService],
})
export class MinioClientModule {}

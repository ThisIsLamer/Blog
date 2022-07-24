import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart = require('fastify-multipart');

import { AppModule } from './app.module';

async function bootstrap() {
  global.AUTHS = {};

  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fastifyMultipart, {
    limits: {
      fieldNameSize: 1024,
      fieldSize: 128 * 1024 * 1024 * 1024,
      fields: 10,
      fileSize: 128 * 1024 * 1024 * 1024,
      files: 2,
      headerPairs: 2000,
    },
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const config = new DocumentBuilder()
    .setTitle('Example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

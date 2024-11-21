import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { env } from './config';
import { AppModule } from './modules/app.module';

const setMiddleware = (app: NestExpressApplication) => {
  app.enableCors({
    credentials: true,
    origin: (_, callback) => callback(null, true),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new Logger('[]'),
  });
  app.useLogger(new Logger('APP'));
  const logger = new Logger('APP');

  app.setGlobalPrefix('api');
  setMiddleware(app);

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('FUN API')
      .setVersion('0.0.9')
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger', app, swaggerDocument, {
      jsonDocumentUrl: 'swagger/json',
    });
  }

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: [env.kafka.broker],
  //       clientId: 'app',
  //     },
  //     consumer: {
  //       groupId: `my-consumer-group`,
  //     },
  //     serializer: new CustomKafkaSerializer(),
  //   },
  // });

  // await app.startAllMicroservices();

  await app.listen(env.port, () =>
    logger.warn(`> Listening App on port ${env.port}`),
  );
}

bootstrap();

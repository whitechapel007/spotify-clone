import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,

      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints ?? {}).join(', '),
        }));

        return new BadRequestException({
          message: 'Validation failed',
          errors: result,
        });
      },
    }),
  );

  app.useLogger(app.get(Logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

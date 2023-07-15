import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  const port = configService.get<string>('app.port');
  await app.listen(port, () => {
    console.log(
      '🚀 Start at port: ',
      port,
      '. Node version: ',
      process.version,
    );
  });
}
bootstrap();

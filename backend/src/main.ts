import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global
  app.setGlobalPrefix('api');

  //Activamos las validaciones aut de los DTOs
  app.useGlobalPipes(new ValidationPipe());

  //React se conecte sin bloqueos de seguridad
  app.enableCors();

  await app.listen(3000);
}
void bootstrap();

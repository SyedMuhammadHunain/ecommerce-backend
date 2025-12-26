import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuring Swagger API
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setVersion('1.0')
    .addTag('E-Commerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  const port = 3000;
  await app.listen(process.env.PORT ?? port);
  Logger.log(`Application running on port ${port}`);
}
bootstrap();

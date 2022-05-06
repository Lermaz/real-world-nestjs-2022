import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const addSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Real World Nest.js 2022')
    .setDescription('Documentation of the API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
};

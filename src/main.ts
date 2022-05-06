import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addSwagger } from './utils/swagger';
import { CustomValidationPipe } from './utils/validation-pipe';
//import * as cors from 'cors';
//import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(`api`);
  app.useGlobalPipes(new CustomValidationPipe());

  // Add security CORS
  /* Use only on production env */
  //app.use(cors);
  // Add security provider by helmet
  /* Use only on production env */
  //app.use(helmet());
  // Add SwaggerModule into the project
  addSwagger(app);

  // Add port listen project
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

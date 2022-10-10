import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Callback, Context, Handler} from "aws-lambda";
import serverlessExpress from '@vendia/serverless-express';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {ValidationPipe} from "@nestjs/common";

let server: Handler;

async function preBootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Omni')
      .setDescription('Omni API description')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.init();

  return app
}

async function bootstrap(): Promise<Handler> {
  const app = await preBootstrap()

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

async function bootstrapLocal() {
  const app = await preBootstrap()
  await app.listen(3000)
}

if (process.env.LOCAL === "true") {
  bootstrapLocal()
}

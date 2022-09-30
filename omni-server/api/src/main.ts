import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Callback, Context, Handler} from "aws-lambda";
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const api: Handler = async (
    event: any,
    context: Context,
    callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

async function bootstrapLocal() {
  const app = await NestFactory.create(AppModule, { cors: true });

  await app.listen(3000)
}

if (process.env.LOCAL === "true") {
  bootstrapLocal()
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRoot({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    type: "postgres",
    port: 5432,
    database: "omni",
    entities: []
  })],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

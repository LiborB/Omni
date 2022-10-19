import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from './playlist/playlist.module';
import { AuthTokenMiddleware } from './auth-token.middleware';
import { SongModule } from './song/song.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { SharedModule } from './shared/shared.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      type: 'postgres',
      port: 5432,
      database: 'omni',
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
    }),
    PlaylistModule,
    SongModule,
    ArtistModule,
    AlbumModule,
    SharedModule,
    QueueModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthTokenMiddleware).forRoutes('*');
  }
}

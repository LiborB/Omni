import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  title: string;

  @ManyToOne(() => Album, (album) => album.songs)
  album?: Album;

  @Column({
    nullable: true,
  })
  duration: number | null;

  @Column()
  userId: string;

  @ManyToMany(() => Playlist, (playlist) => playlist.songs)
  playlists: Playlist[];

  @ManyToOne(() => Artist, (artist) => artist.songs)
  artist?: Artist;
}

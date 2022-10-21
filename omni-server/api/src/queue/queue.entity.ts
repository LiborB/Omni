import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Artist } from '../artist/artist.entity';
import { Song } from '../song/song.entity';

@Entity()
export class SongQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => Song, (song) => song.songQueues)
  song: Song;

  @Column()
  order: number;
}

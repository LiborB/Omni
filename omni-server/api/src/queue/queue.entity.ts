import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Song } from '../song/song.entity';

@Entity()
@Unique(["id", "isPlaying"])
export class SongQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => Song, (song) => song.songQueues)
  song: Song;

  @Column()
  order: number;

  @Column()
  isPlaying: boolean
}

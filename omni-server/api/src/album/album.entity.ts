import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Song } from '../song/song.entity';

@Entity()
@Unique(['userId', 'name'])
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  name: string;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];
}

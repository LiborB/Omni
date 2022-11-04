import { Song } from '../song/song.model';

export interface SongQueueItem {
  id: number;
  song: Song;
  order: number;
  isPlaying: boolean
}

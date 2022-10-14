import { Album } from '../album/album.model';
import { Artist } from '../artist/artist.model';

export interface Song {
  id: number;
  title: string;
  album?: Album;
  artist?: Artist;
  duration?: number;
  extension: string;
}

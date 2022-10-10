import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(private http: HttpClient) {}

  getAllSongs() {
    return this.http.get<Song[]>('/song/all');
  }

  getSongs(playlistId: number) {
    return this.http.get<Song[]>(`/song/playlist/${playlistId}`);
  }

  addSongs(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    return this.http.post('/song', formData);
  }
}

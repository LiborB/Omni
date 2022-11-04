import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from './song.model';
import {BehaviorSubject, filter} from 'rxjs';
import { SharedService } from '../shared/shared.service';
import {QueueService} from "../queue/queue.service";

@Injectable({
  providedIn: 'root',
})
export class SongService {
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

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

  addSongToPlaylist(songId: number, playlistId: number) {
    return this.http.post(`/song/${songId}/playlist/${playlistId}`, null);
  }

  getSongPlaybackUrl(song: Song) {
    return `${this.sharedService.apiBaseUrl}/song/${song.id}/play`;
  }
}

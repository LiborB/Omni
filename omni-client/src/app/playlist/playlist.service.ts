import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Playlist {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private _playlists = new BehaviorSubject<Playlist[]>([]);
  playlists = this._playlists.asObservable();

  private _selectedPlaylist = new Subject<Playlist | null>();
  selectedPlaylist = this._selectedPlaylist.asObservable();

  constructor(private httpClient: HttpClient) {}

  setSelectedPlaylist(playlist: Playlist | null) {
    this._selectedPlaylist.next(playlist);
  }

  fetchPlaylists() {
    return this.httpClient
      .get<Playlist[]>('/playlist')
      .subscribe((res) => this._playlists.next(res));
  }
}

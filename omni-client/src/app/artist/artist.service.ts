import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Song} from "../song/song.model";
import {HttpClient} from "@angular/common/http";
import {Artist} from "./artist.model";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private http: HttpClient) { }

  getSongs(artistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`/artist/${artistId}/songs`)
  }

  getArtist(artistId: number): Observable<Artist> {
    return this.http.get<Artist>(`/artist/${artistId}`)
  }
}

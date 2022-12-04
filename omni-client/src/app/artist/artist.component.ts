import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArtistService} from "./artist.service";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Song} from "../song/song.model";
import {Artist} from "./artist.model";

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {
  songs: Song[] = []
  artist: Artist | null = null
  private subs = new Subscription()

  constructor(private artistService: ArtistService, private route: ActivatedRoute) {
    this.subs.add(this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        return
      }

      this.fetchArtistSongs(parseInt(id));
      this.fetchArtist(parseInt(id))
    }))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }

  fetchArtistSongs(artistId: number) {
    this.subs.add(this.artistService.getSongs(artistId).subscribe(songs => {
      this.songs = songs
    }))
  }

  fetchArtist(artistId: number) {
    this.subs.add(this.artistService.getArtist(artistId).subscribe(artist => {
      this.artist = artist
    }))
  }
}

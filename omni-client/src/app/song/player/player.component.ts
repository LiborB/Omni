import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { Howl } from 'howler';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  song: Song | null = null;

  private subs = new Subscription();

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.subs.add(
      this.songService.currentPlayingSong.subscribe((song) => {
        this.song = song;
      })
    );
  }

  startSong(song: Song) {
    const sound = new Howl({
      src: this.songService.getSongPlaybackUrl(song),
    });

    sound.play();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SongService } from '../song.service';
import { Song } from '../song.model';
import { Howl } from 'howler';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  song: Song | null = null;

  private subs = new Subscription();

  constructor(
    private songService: SongService,
    private authService: AuthenticatorService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.songService.currentPlayingSong.subscribe((song) => {
        this.song = song;

        if (song) {
          this.startSong(song);
        }
      })
    );
  }

  startSong(song: Song) {
    const sound = new Howl({
      src: this.songService.getSongPlaybackUrl(song),
      format: song.extension.replace('.', ''),
      xhr: {
        method: 'GET',
        headers: {
          authorization: `Bearer ${this.authService.user
            .getSignInUserSession()
            ?.getAccessToken()
            .getJwtToken()}`,
        },
      },
    });

    sound.play();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

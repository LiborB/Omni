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

  playingSongInterval: NodeJS.Timer | null = null;
  playingSongProgress = 0;
  private sound: Howl | null = null;

  constructor(
    private songService: SongService,
    private authService: AuthenticatorService
  ) {}

  get isPlaying() {
    return this.sound?.playing();
  }

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
    this.playingSongProgress = 0;
    this.sound?.stop();

    this.sound = new Howl({
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

    this.sound.play();

    if (this.playingSongInterval) {
      clearInterval(this.playingSongInterval);
    }

    this.playingSongInterval = setInterval(() => {
      this.playingSongProgress = Math.round(
        (this.sound!.seek() / this.sound!.duration()) * 100
      );
    }, 100);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  barClick(ev: MouseEvent) {
    if (!this.sound) {
      return;
    }

    const target = ev.currentTarget as HTMLDivElement;

    const rect = target.getBoundingClientRect();
    const duration = this.sound.duration();
    const newPercent = (ev.clientX - rect.left) / rect.width;

    this.sound.seek(duration * newPercent);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.sound?.pause();
    } else {
      this.sound?.play();
    }
  }
}

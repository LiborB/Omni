import {Component, OnDestroy, OnInit} from '@angular/core';
import {SongService} from '../song/song.service';
import {ActivatedRoute, Router} from '@angular/router';
import {concat, Subscription} from 'rxjs';
import {Song} from '../song/song.model';
import {Playlist, PlaylistService} from './playlist.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SharedService} from '../shared/shared.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import {QueueService} from '../queue/queue.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();

  songs: Song[] = [];
  selectedPlaylist: Playlist | null = null;
  playlistId: number | null = null;
  messageId?: string;
  isLoadingSongs = false;
  selectedContextMenuSong: Song | null = null;
  playlists: Playlist[] = [];
  currentPlayingSong: Song | null = null;

  constructor(
    private songService: SongService,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private messageService: NzMessageService,
    private sharedService: SharedService,
    private contextMenuService: NzContextMenuService,
    private queueService: QueueService,
    private router: Router
  ) {
  }

  formatSeconds(seconds?: number) {
    if (!seconds) {
      return '';
    }
    return this.sharedService.formatSeconds(seconds);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.playlistId = id ? parseInt(id) : null;

      this.fetchSongs();
    });

    this.subs.add(
      this.playlistService.selectedPlaylist.subscribe(
        (playlist) => (this.selectedPlaylist = playlist)
      )
    );

    this.subs.add(
      this.playlistService.playlists.subscribe((playlists) => {
        this.playlists = playlists;
      })
    );

    this.subs.add(
      this.queueService.playingItem.subscribe(
        (item) => {
          this.currentPlayingSong = item?.song ?? null
        }
      )
    );
  }

  fetchSongs() {
    this.isLoadingSongs = true;
    if (this.playlistId) {
      this.subs.add(
        this.songService.getSongs(this.playlistId).subscribe((songs) => {
          this.songs = songs;
          this.isLoadingSongs = false;
        })
      );
    } else {
      this.subs.add(
        this.songService.getAllSongs().subscribe((songs) => {
          this.songs = songs;
          this.isLoadingSongs = false;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onFileChange(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);

    if (!files.length) {
      return;
    }

    this.messageId = this.messageService.loading('Adding songs...', {
      nzDuration: 0,
    }).messageId;

    this.subs.add(
      this.songService.addSongs(files).subscribe({
        next: () => {
          this.messageService.remove(this.messageId);
          this.fetchSongs();
        },
        error: (err) => {
          this.messageService.remove(this.messageId);
          console.log(err);
        },
      })
    );
  }

  onSongRightClick(
    event: MouseEvent,
    menu: NzDropdownMenuComponent,
    song: Song
  ) {
    this.contextMenuService.create(event, menu);
    this.selectedContextMenuSong = song;
  }

  onAddToPlaylistClick(playlistId: number) {
    const playlist = this.playlists.find(
      (playlist) => playlist.id === playlistId
    );
    if (this.selectedContextMenuSong) {
      this.songService
        .addSongToPlaylist(this.selectedContextMenuSong.id, playlistId)
        .subscribe({
          next: () => {
            this.messageId = this.messageService.success(
              `Added ${this.selectedContextMenuSong?.title} to ${playlist?.name}`
            ).messageId;
          },
          error: () => {
            this.messageId = this.messageService.error(
              `Failed to add song to ${playlist?.name}`
            ).messageId;
          },
        });
    }
  }

  onSongDoubleClick(song: Song) {
    concat(
      this.queueService.clearQueue(),
      this.queueService.addToQueue(song.id, true)
    ).subscribe()
  }

  onAddToQueueClick() {
    const song = this.selectedContextMenuSong;

    if (!song) {
      return;
    }

    this.subs.add(
      this.queueService.addToQueue(song.id, false).subscribe({
        next: () => {
          this.messageId = this.messageService.success(
            `Added ${song.title} to queue`
          ).messageId;
        },
        error: () => {
          this.messageId = this.messageService.error(
            'Uh oh, something went wrong'
          ).messageId;
        },
      })
    );
  }

  async artistClick(artistId?: number) {
    if (artistId) {
      await this.router.navigate(["/artist", artistId])
    }
  }
}

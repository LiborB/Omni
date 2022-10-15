import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongService } from '../song/song.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Song } from '../song/song.model';
import { Playlist, PlaylistService } from './playlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../shared/shared.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();

  songs: Song[] = [];
  selectedPlaylist: Playlist | null = null;
  isDraggingFiles = false;
  playlistId: number | null = null;
  dropdownOpen = false;
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
    private contextMenuService: NzContextMenuService
  ) {}

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
      this.songService.currentPlayingSong.subscribe(
        (song) => (this.currentPlayingSong = song)
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
    this.songService.setPlayingSong(song);
  }
}

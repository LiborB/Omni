import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongService } from '../song/song.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Song } from '../song/song.model';
import { Playlist, PlaylistService } from './playlist.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SharedService } from '../shared/shared.service';

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
  loadingId?: string;
  isLoadingSongs = false;

  constructor(
    private songService: SongService,
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private messageService: NzMessageService,
    private sharedService: SharedService
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
  }

  onFileDragEnter(ev: DragEvent) {
    ev.preventDefault();

    this.isDraggingFiles = true;
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

    this.loadingId = this.messageService.loading('Adding songs...', {
      nzDuration: 0,
    }).messageId;

    this.subs.add(
      this.songService.addSongs(files).subscribe({
        next: () => {
          this.messageService.remove(this.loadingId);
          this.fetchSongs();
        },
        error: (err) => {
          this.messageService.remove(this.loadingId);
          console.log(err);
        },
      })
    );
  }
}

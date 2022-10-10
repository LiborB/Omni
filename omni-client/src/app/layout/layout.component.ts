import { Component, OnDestroy, OnInit } from '@angular/core';
import { Playlist, PlaylistService } from '../playlist/playlist.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  playlists: Playlist[] = [];
  private playlistSubscription?: Subscription;

  private selectedPlaylistSubscription?: Subscription;
  selectedPlaylist: Playlist | null = null;

  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.playlistService.fetchPlaylists();
    this.playlistSubscription = this.playlistService.playlists.subscribe(
      (playlists) => (this.playlists = playlists)
    );
    this.selectedPlaylistSubscription =
      this.playlistService.selectedPlaylist.subscribe((playlist) => {
        this.selectedPlaylist = playlist;
      });
  }

  ngOnDestroy() {
    this.playlistSubscription?.unsubscribe();
  }

  async onPlaylistClick(playlist: Playlist) {
    this.playlistService.setSelectedPlaylist(playlist);
    await this.router.navigate(['/playlist', playlist.id]);
  }

  async onAllSongsClick() {
    this.playlistService.setSelectedPlaylist(null);
    await this.router.navigate(['/playlist']);
  }
}

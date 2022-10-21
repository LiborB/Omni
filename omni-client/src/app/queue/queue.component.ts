import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueueService } from './queue.service';
import { SongQueueItem } from './song-queue-item.model';
import { Subscription } from 'rxjs';
import { SongService } from '../song/song.service';
import { Song } from '../song/song.model';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  queueItems: SongQueueItem[] = [];
  playingSong: Song | null = null;

  constructor(
    private queueService: QueueService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.queueService.queueUpdated.subscribe(() => this.fetchQueueSongs())
    );

    this.subs.add(
      this.songService.currentPlayingSong.subscribe((song) => {
        this.playingSong = song;
      })
    );
  }

  fetchQueueSongs() {
    this.subs.add(
      this.queueService
        .getSongQueue()
        .subscribe((queueItems) => (this.queueItems = queueItems))
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onDoubleClick(item: SongQueueItem) {
    this.songService.setPlayingSong(item.song);
  }
}

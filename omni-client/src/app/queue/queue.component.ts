import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueueService } from './queue.service';
import { SongQueueItem } from './song-queue-item.model';
import { Subscription } from 'rxjs';
import { SongService } from '../song/song.service';
import { Song } from '../song/song.model';
import {orderBy} from "lodash";

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  queueItems: SongQueueItem[] = [];
  playingItem: SongQueueItem | null = null;

  constructor(
    private queueService: QueueService,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.queueService.queueItems.subscribe(items => this.queueItems = orderBy(items, item => item.order))
    );

    this.subs.add(
      this.queueService.playingItem.subscribe((item) => {
        this.playingItem = item ?? null;
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onDoubleClick(item: SongQueueItem) {
    this.queueService.updatingPlayingStatus(item.id, true).subscribe()
  }
}

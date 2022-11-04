import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, distinct, distinctUntilChanged, map, Observable, tap} from 'rxjs';
import {SongQueueItem} from './song-queue-item.model';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private _queueItems = new BehaviorSubject<SongQueueItem[]>([])
  queueItems = this._queueItems.asObservable()

  playingItem = this.queueItems.pipe(map(items => {
    return items.find(x => x.isPlaying) ?? null
  }), distinctUntilChanged((prev, curr) => prev?.id === curr?.id))

  constructor(private httpClient: HttpClient) {
    this.setQueueUpdated()
  }

  setQueueUpdated() {
    this.getSongQueue().subscribe(res => {
      this._queueItems.next(res)
    })
  }

  private getSongQueue(): Observable<SongQueueItem[]> {
    return this.httpClient.get<SongQueueItem[]>('/queue');
  }

  addToQueue(songId: number, isPlaying: boolean) {
    return this.httpClient.post(`/queue/add/${songId}`, {
      isPlaying
    }).pipe(tap(() => this.setQueueUpdated()));
  }

  removeFromQueue(id: number) {
    return this.httpClient.post(`/queue/remove/${id}`, {}).pipe(tap(() => this.setQueueUpdated()));
  }

  clearQueue() {
    return this.httpClient.post('/queue/clear', {}).pipe(tap(() => this.setQueueUpdated()));
  }

  updatingPlayingStatus(id: number, isPlaying: boolean) {
    return this.httpClient.post(`/queue/playingstatus/${id}`, {
      isPlaying
    }).pipe(tap(() => this.setQueueUpdated()))
  }

  playNextSong() {
    return this.httpClient.post("/queue/playnextsong", {}).pipe(tap(() => this.setQueueUpdated()))
  }

  playPreviousSong() {
    return this.httpClient.post("/queue/playprevioussong", {}).pipe(tap(() => this.setQueueUpdated()))
  }
}

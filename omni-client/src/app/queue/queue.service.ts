import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SongQueueItem } from './song-queue-item.model';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private _queueUpdated = new BehaviorSubject<void>(undefined);
  queueUpdated = this._queueUpdated.asObservable();

  constructor(private httpClient: HttpClient) {}

  setQueueUpdated() {
    this._queueUpdated.next();
  }

  getSongQueue(): Observable<SongQueueItem[]> {
    return this.httpClient.get<SongQueueItem[]>('/queue');
  }

  addToQueue(songId: number) {
    return this.httpClient.post(`/queue/add/${songId}`, {});
  }

  removeFromQueue(id: number) {
    return this.httpClient.post(`/queue/remove/${id}`, {});
  }

  clearQueue() {
    return this.httpClient.post('/queue/clear', {});
  }
}

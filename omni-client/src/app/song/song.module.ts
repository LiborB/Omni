import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player/player.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  PlayCircleOutline,
  StepBackwardOutline,
  StepForwardOutline,
} from '@ant-design/icons-angular/icons';

@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule.forChild([
      PlayCircleOutline,
      StepForwardOutline,
      StepBackwardOutline,
    ]),
  ],
  exports: [PlayerComponent],
})
export class SongModule {}

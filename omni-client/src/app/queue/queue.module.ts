import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueComponent } from './queue.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@NgModule({
  declarations: [QueueComponent],
  exports: [QueueComponent],
  imports: [CommonModule, NzListModule, NzTypographyModule],
})
export class QueueModule {}

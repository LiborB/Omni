import { Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['id', 'userId'])
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;
}

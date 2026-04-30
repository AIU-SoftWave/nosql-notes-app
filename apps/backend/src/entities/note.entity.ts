import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Comment } from './comment.entity';

@Entity('notes')
export class Note {
  @ObjectIdColumn()
  id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ default: [] })
  tags!: string[];

  @Column({ default: [] })
  comments!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

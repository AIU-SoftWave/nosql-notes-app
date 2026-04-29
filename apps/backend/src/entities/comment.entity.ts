import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';

export class Comment {
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}

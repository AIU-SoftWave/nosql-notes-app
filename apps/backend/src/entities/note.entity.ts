import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Comment, CommentSchema } from './comment.entity';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  collection: 'notes',
  timestamps: true,
})
export class Note {
  @ApiProperty({ example: '65f1d7c7f1d7c7f1d7c7f1d7' })
  id?: string;

  @ApiProperty({ example: 'Meeting notes' })
  @Prop({ required: true, trim: true })
  title!: string;

  @ApiProperty({ example: 'Capture the important points from the meeting.' })
  @Prop({ required: true, trim: true })
  content!: string;

  @ApiProperty({ type: [String], example: ['work', 'meeting'] })
  @Prop({ type: [String], default: [] })
  tags!: string[];

  @ApiProperty({ type: [Comment] })
  @Prop({ type: [CommentSchema], default: [] })
  comments!: Comment[];

  @ApiProperty({ example: 42 })
  @Prop({ default: 0 })
  views!: number;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  updatedAt!: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ title: 'text', content: 'text' });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ createdAt: -1 });

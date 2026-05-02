import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Comment, CommentSchema } from './comment.entity';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  collection: 'notes',
  timestamps: true,
})
export class Note {
  @ApiProperty({ example: '65f1d7c7f1d7c7f1d7c7f1d7' })
  id?: string;

  @ApiProperty({ example: '65f1d7c7f1d7c7f1d7c7f1d7' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

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

  @ApiProperty({ example: false })
  @Prop({ default: false })
  isPublic!: boolean;

  @ApiProperty({ example: 42 })
  @Prop({ default: 0 })
  views!: number;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  updatedAt!: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

// Text search index for full-text search
NoteSchema.index({ title: 'text', content: 'text' });

// Compound index for tag filtering with visibility check
NoteSchema.index({ tags: 1, isPublic: 1, createdAt: -1 });

// Compound index for user's notes with visibility (most common query pattern)
NoteSchema.index({ userId: 1, isPublic: 1, createdAt: -1 });

// Sparse index for popular notes (views > 100) - leaderboard queries
NoteSchema.index(
  { views: -1 },
  { partialFilterExpression: { views: { $gt: 100 } } },
);

// Single field indexes for individual filters
NoteSchema.index({ createdAt: -1 });
NoteSchema.index({ userId: 1 });
NoteSchema.index({ isPublic: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class Comment {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: () => new Date() })
  date: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ default: 0 })
  views: number;
}

export type NoteDocument = HydratedDocument<Note> & {
  _id: Types.ObjectId;
};

export const NoteSchema = SchemaFactory.createForClass(Note);
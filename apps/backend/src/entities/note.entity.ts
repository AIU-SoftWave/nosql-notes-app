import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Comment, CommentSchema } from './comment.entity';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true, collection: 'notes' })
export class Note {
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [CommentSchema], default: [] })
  comments!: Comment[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);

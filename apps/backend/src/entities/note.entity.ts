import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './comment.entity';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  collection: 'notes',
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      const result = ret as Record<string, any>;
      result.id = result._id?.toString();
      delete result._id;
      delete result.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      const result = ret as Record<string, any>;
      result.id = result._id?.toString();
      delete result._id;
      delete result.__v;
      return ret;
    },
  },
})
export class Note {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  content!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [CommentSchema], default: [] })
  comments!: Comment[];

  createdAt!: Date;
  updatedAt!: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

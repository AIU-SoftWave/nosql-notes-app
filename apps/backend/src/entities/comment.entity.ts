import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Comment {
  @Prop({ required: true, trim: true })
  content!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

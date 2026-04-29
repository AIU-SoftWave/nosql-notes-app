import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: { createdAt: true, updatedAt: false } })
export class Comment {
  @Prop({ required: true })
  content!: string;

  createdAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Comment {
  @ApiProperty({ example: 'Follow up next week.' })
  @Prop({ required: true, trim: true })
  content!: string;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

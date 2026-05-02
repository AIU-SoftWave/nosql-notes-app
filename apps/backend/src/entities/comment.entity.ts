import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ _id: false })
export class Comment {
  @ApiProperty({
    example: 'Follow up next week.',
    maxLength: 1000,
    minLength: 1,
  })
  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000,
    validate: {
      validator: function (v: string) {
        // Prevent HTML/script injection at schema level
        return !/<script|javascript:|on\w+\s*=|<iframe|<object/i.test(v);
      },
      message: 'Comment contains potentially malicious content',
    },
  })
  content!: string;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

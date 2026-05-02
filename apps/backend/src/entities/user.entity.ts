import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @ApiProperty({ example: '65f1d7c7f1d7c7f1d7c7f1d7' })
  id?: string;

  @ApiProperty({ example: 'johndoe' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  username!: string;

  @ApiProperty({ example: 'hashed_password' })
  @Prop({ required: true })
  password!: string;

  @ApiProperty({ example: '2026-04-30T12:00:00.000Z' })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
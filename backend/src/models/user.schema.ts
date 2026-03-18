import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../enums/roles.enums'

export interface User {
  _id: string;
  name: string;
  password: string;
  email: string;
  isVerified: boolean;
  hashedRefreshToken: string;
  passwordResetToken: string;
  passwordResetTokenExpiresAt: Date;
  role: Roles;
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: '' })
  hashedRefreshToken: string;

  @Prop({ default: null })
  passwordResetToken: string;

  @Prop({ default: null })
  passwordResetTokenExpiresAt: Date;

  @Prop({ 
    type: String, 
    enum: Object.values(Roles), 
    default: 'user'
  })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);

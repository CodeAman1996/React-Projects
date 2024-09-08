import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Document
} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

   @Prop({
    required: true,
  })
   first_name: string;
   @Prop()
   last_name: string;
   @Prop({
    required: true,
    unique: true,
  })
   email: string;
   @Prop()
   avatar: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
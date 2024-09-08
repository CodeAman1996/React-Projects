import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {
  Document
} from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
 
   @Prop({
    required: true,
  })
   userId: string;
   @Prop({
    required: true,
  })
   hash: string;
   
}
export const AvatarSchema = SchemaFactory.createForClass(Avatar);
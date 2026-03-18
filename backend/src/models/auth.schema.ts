import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Auth {
    @Prop({ required: true })
    email: string;
    @Prop({ required: true })
    code: string;
    @Prop({ required: true })
    createdAt: Date;
    @Prop({ required: true })
    expiresAt: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
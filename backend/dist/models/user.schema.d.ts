import { Document } from 'mongoose';
import { Roles } from '../enums/roles.enums';
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
export declare class User {
    name: string;
    password: string;
    email: string;
    isVerified: boolean;
    hashedRefreshToken: string;
    passwordResetToken: string;
    passwordResetTokenExpiresAt: Date;
    role: Roles;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & Required<{
    _id: string;
}> & {
    __v: number;
}>;

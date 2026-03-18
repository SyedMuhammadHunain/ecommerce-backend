export declare class Auth {
    email: string;
    code: string;
    createdAt: Date;
    expiresAt: Date;
}
export declare const AuthSchema: import("mongoose").Schema<Auth, import("mongoose").Model<Auth, any, any, any, import("mongoose").Document<unknown, any, Auth, any, {}> & Auth & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Auth, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Auth>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Auth> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;

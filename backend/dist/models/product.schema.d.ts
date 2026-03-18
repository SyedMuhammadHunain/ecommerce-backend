import { Document, Types } from 'mongoose';
export declare class Product extends Document {
    productName: string;
    price: number;
    description: string;
    userId: Types.ObjectId;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Product> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;

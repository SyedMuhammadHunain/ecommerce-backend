import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dtos/addToCart.dto';
import { Cart } from '../models/cart.schema';
import { CustomRequest } from '../interfaces/request.interface';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addToCart(req: CustomRequest, body: AddToCartDto): Promise<Cart>;
    getCart(req: CustomRequest): Promise<Cart | (import("mongoose").FlattenMaps<Cart> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}

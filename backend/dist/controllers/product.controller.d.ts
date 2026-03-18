import { Product } from '../models/product.schema';
import { ProductDto } from '../dtos/product.dto';
import { ProductService } from '../services/product.service';
import { UpdatedProductDto } from '../dtos/updatedProduct.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    create(productDto: ProductDto, req: any): Promise<Product>;
    getAll(req: any): Promise<Product[]>;
    getById(productId: string, req: any): Promise<Product>;
    deleteById(id: string, req: any): Promise<void>;
    update(id: string, updatedProductDto: UpdatedProductDto, req: any): Promise<Product>;
}

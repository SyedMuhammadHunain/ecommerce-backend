import {
  Controller,
  Post,
  Body,
  // Get,
  // Param,
  // Delete,
  // Patch,
  UseGuards,
  Req,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { Product } from 'src/models/product.schema';
import { ProductDto } from 'src/dtos/product.dto';
import { ProductService } from 'src/services/product.service';
// import { UpdatedProductDto } from 'src/dtos/updatedProduct.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdatedProductDto } from 'src/dtos/updatedProduct.dto';

@Controller('product')
@UseGuards(AuthGuard, RolesGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @Roles('seller')
  create(@Body() productDto: ProductDto, @Req() req: any): Promise<Product> {
    const userId = req.user.sub;
    return this.productService.create(productDto, userId);
  }

  @Get()
  @Roles('seller', 'customer')
  getAll(@Req() req: any): Promise<Product[]> {
    const userId = req.user.sub;
    return this.productService.getAll(userId);
  }

  @Get('/:id')
  @Roles('seller', 'customer')
  getById(@Param('id') productId: string, @Req() req: any): Promise<Product> {
    const userId = req.user.sub;
    return this.productService.getById(productId, userId);
  }

  @Delete('/:id')
  @Roles('seller')
  deleteById(@Param('id') id: string, @Req() req: any): Promise<void> {
    const userId = req.user.sub;
    return this.productService.deleteById(id, userId);
  }

  @Patch('/:id')
  @Roles('seller')
  update(
    @Param('id') id: string,
    @Body() updatedProductDto: UpdatedProductDto,
    @Req() req: any,
  ): Promise<Product> {
    const userId = req.user.sub;
    return this.productService.update(id, updatedProductDto, userId);
  }
}

import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ProductDto {
  @Length(5, 50, { message: 'Name must be between 5 and 50 characters' })
  @IsString()
  @IsNotEmpty({ message: 'Name of product is required' })
  @Matches(/^[A-Za-z0-9\s]+$/)
  productName: string;

  @IsNotEmpty({ message: 'Price of product is required' })
  price: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  @Length(15, 500, {
    message: 'Description must be between 15 and 500 characters',
  })
  description: string;
}

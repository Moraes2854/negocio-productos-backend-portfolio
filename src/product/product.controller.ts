import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Auth } from '../auth/decorators';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth('admin', 'super-user')
  create(@Body() createProductDto: CreateProductDto):Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query() paginationDto:PaginationDto,
  ):Promise<Product[]> {
    return this.productService.findAll(paginationDto);
  }

  @Get(':barcode')
  findOneByBarcode(@Param('barcode') barcode: string):Promise<Product> {
    return this.productService.findOneByBarcode(barcode);
  }

  @Patch(':id')
  @Auth('admin', 'super-user')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto
  ):Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Auth('admin')
  remove(@Param('id') id: string):Promise<boolean> {
    return this.productService.remove(id);
  }
}

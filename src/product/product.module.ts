import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports:[
    TypeOrmModule.forFeature([Product]),
    AuthModule
  ],
  exports:[
    ProductService,
    TypeOrmModule
  ],
})
export class ProductModule {}

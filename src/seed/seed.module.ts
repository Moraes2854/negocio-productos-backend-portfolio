import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    AuthModule,
    ProductModule,
    ConfigModule,
  ]
})
export class SeedModule {}

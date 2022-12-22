import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { SeedModule } from './seed/seed.module';
import { BackupModule } from './backup/backup.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type:'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true,
    }),
    ServeStaticModule.forRoot({
      rootPath:join(__dirname, '..', 'client')
    }),
    CommonModule,
    ProductModule,
    AuthModule,
    SeedModule,
    BackupModule
  ],
})
export class AppModule {}

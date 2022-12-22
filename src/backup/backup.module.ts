import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BackupController],
  providers: [BackupService],
  imports:[
    AuthModule,
    ConfigModule
  ]
})
export class BackupModule {}

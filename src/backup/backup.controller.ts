import * as fs from 'fs';
import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { BackupService } from './backup.service';
import { Auth } from '../auth/decorators';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  @Auth('super-user','admin')
  async downloadBackup(
    @Res() res:Response
  ){
    const fileURL = await this.backupService.generateBackup();
    res.contentType('application/sql');
    res.setHeader('Content-Disposition', `attachment; filename="backup.sql"`);
    return res.download(fileURL, (err)=>{
      if (err) throw err;
      fs.unlinkSync(fileURL);
    });
  }
}

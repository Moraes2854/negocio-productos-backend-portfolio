import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysqldump from 'mysqldump';

@Injectable()
export class BackupService {

    constructor(
        private readonly configService:ConfigService,
      ){}


    async generateBackup():Promise<string> {
        return new Promise((resolve, reject)=>{

            const fileName = `backup.sql`;
            const fileURL = `${__dirname}/${fileName}`;
    
            
            mysqldump({
                connection: {
                    host: this.configService.getOrThrow('DB_HOST'),
                    user: this.configService.getOrThrow('DB_USERNAME'),
                    password: this.configService.getOrThrow('DB_PASSWORD'),
                    database: this.configService.getOrThrow('DB_NAME'),
                },
                dumpToFile: fileURL,
                dump:{
                    tables:['products'],
                    data:{
                        maxRowsPerInsertStatement:10000000
                    }
                }
            })
            .then((value)=>{
                resolve(fileURL);
            })
            .catch((err)=>{
                reject(err);
            })
            
            // res.contentType('application/sql');
            // res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            // res.download(fileURL, (err)=>{
            //   if (err) throw err;
            //   fs.unlinkSync(fileURL);
            // });
        })
    }

}

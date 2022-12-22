import * as fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { ValidRoles } from '../auth/interfaces';

import { User } from '../auth/entities/user.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectRepository(User)
    private readonly usersRepository:Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository:Repository<Product>,
    private readonly authService:AuthService,
    private readonly dataSource:DataSource,
    private readonly configService:ConfigService,
  ){}

  async runSeed(){
    if (this.configService.get('SEED_EXECUTED') === "FALSE"){
      try {
        
        await this.deleteAllTables();
        await this.insertProducts();
        await this.insertUsers();

        return 'SEED EXECUTED';
        
      } catch (error) {
        throw new InternalServerErrorException('Error executing seed');
      }

    }
    else return 'SEED HAS BEEN ALREADY EXECUTED';
  }

  private async deleteAllTables  (){
    await this.usersRepository.delete({});
    await this.productsRepository.delete({});
  }

  private async insertUsers(){

    // const roleSuperUser:ValidRoles[]=['user', 'super-user']
    const rolesAdmin:ValidRoles[]=['user', 'super-user', 'admin']

    await this.authService.createUser(({
      email:this.configService.get('email'),
      password:this.configService.get('password'),
      fullName:this.configService.get('fullName'),
    }), rolesAdmin);

    return true;
  }

  private async insertProducts():Promise<boolean>{
    return new Promise(async (res, rej)=>{

      fs.readFile(`${__dirname}/../../backup/backup.sql`, async(err, buff)=>{
        if (err){
          console.log(err);
          rej(err);
        }
        else {
          try {
            const queryRunner = this.dataSource.createQueryRunner(); 
            await queryRunner.connect();
        
            await queryRunner.manager.query(buff.toString());
            await queryRunner.release();
        
            await this.productsRepository.update({enabled:false}, {
              enabled:true
            });
            
            res(true);
          } catch (error) {
            console.log(error);
            throw new InternalServerErrorException('Error executing seed');
          }
        }
      });
    })
    
  }
}

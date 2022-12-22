import { Injectable, BadRequestException, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';


import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidRoles } from './interfaces';


@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private readonly jwtService:JwtService,
    ){
    }

    async createUser(createUserDto: CreateUserDto, roles?:ValidRoles[]){
        
        try {

            const user = this.userRepository.create({
                ...createUserDto,
                roles
            });

            await this.userRepository.save( user );

            delete user.password;

            return {
                ...user,
                token:this.getJwtToken({id:user.id})
            };

        } catch (error) {
            this.handleDBErrors(error);
        }

        
    }

    async loginUser(loginUserDto: LoginUserDto){
      
        const { password, email } = loginUserDto;

        const user = await this.userRepository.findOne({
            where:{
                email
            },
            select:{email:true, fullName:true, id:true, isActive:true, password:true, roles:true}
        });

        if (!user) throw new UnauthorizedException('Creadential are not valid (email)');

        if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Creadential are not valid (password)');
        

        return {
            ...user,
            token:this.getJwtToken({id:user.id})
        };

    }

    async checkAuthStatus(user:User){
        return {
            ...user,
            token:this.getJwtToken({id:user.id})
        };
    }

    async findAllUsers(){
        return await this.userRepository.find();
    }

    private getJwtToken(payload:JwtPayload){

        const token = this.jwtService.sign(payload);

        return token;


    }

    

    private handleDBErrors(error): never{
        
        this.logger.error(error);

        if (error.code === '23505') throw new BadRequestException(error.detail);

        throw new InternalServerErrorException('Please check server logs');
    }

}

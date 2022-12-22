import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { GetUser, Auth } from './decorators';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  getUsers(){
    return this.authService.findAllUsers();
  }
  
  @Post('register')
  @Auth('admin')
  register(@Body() createUserDto: CreateUserDto ) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto:LoginUserDto){
    return this.authService.loginUser(loginUserDto)
  }

  @Get('checkToken')
  @Auth()
  checkAuthStatus(
    @GetUser() user:User,
  ){
    return this.authService.checkAuthStatus(user);
  }
}
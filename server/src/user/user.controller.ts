import { Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/')
	async index(@Req() request) : Promise<GetUserDto> {
		return request.user;
	}

	@Post('/')
	async store(@Body() user: CreateUserDto): Promise<GetUserDto> {
		return this.userService.create(user);
	}

	@Get('/id/:id')
	async show(@Param('id') id: number) : Promise<GetUserDto> {
		return this.userService.get(id);
	}

	@Get('/login/:login')
	async showLogin(@Param('login') login: string) : Promise<GetUserDto> {
		return this.userService.getByLogin(login);
	}

	@Delete('/:id')
	async delete(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Post('/changelogin/:newLogin')
	async changeLogin(@Param('newLogin') newLogin: string, @Req() request) {
		await this.userService.newLogin(request.user.login, newLogin);
	}

	@Post('/uploadimage')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request) {
	  console.log("file : ", file);
	  console.log("user : ", request.user.login);
	  return this.userService.addAvatar(request.user.login, file.buffer, file.originalname);
	  //await this.userService.setNewAvatar(file, request.user.login);
	}
}

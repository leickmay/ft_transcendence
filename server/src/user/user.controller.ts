import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
	async index(@Req() request) : Promise<User> {
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
}

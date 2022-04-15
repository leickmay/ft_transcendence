import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, Req } from '@nestjs/common';
import { request } from 'http';
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

	@Get('/:id')
	async show(@Param('id') id: number) : Promise<GetUserDto> {
		return this.userService.get(id);
	}

	@Delete('/:id')
	async delete(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}
}

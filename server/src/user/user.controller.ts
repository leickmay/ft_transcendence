import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/')
	async new(@Body() user: CreateUserDto): Promise<GetUserDto> {
		return this.userService.create(user);
	}

	@Delete('/:id')
	async remove(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Get('/:id')
	async getById(@Param('id') id: number) : Promise<GetUserDto> {
		return this.userService.getById(id);
	}

	@Get('/')
	async getAll() : Promise<GetUserDto[]> {
		return this.userService.getAll();
	}
}

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post('/new')
	async new(@Body() user: CreateUserDto): Promise<void> {
		this.userService.create(user);
	}

	@Delete('/delete/:id')
	async remove(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Get('/get/:id')
	async getById(@Param('id') id: number) : Promise<User> {
		return this.userService.getById(id);
	}

	@Post('/code/:id')
	async code(@Param('id') id: string) : Promise<string> {
		return this.userService.connection(id);
	}
}

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/new')
	async new(@Body() user: CreateUserDto): Promise<User> {
		return this.userService.create(user);
	}

	@Delete('/deleteById/:id')
	async remove(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Get('/getById/:id')
	async getById(@Param('id') id: number) : Promise<User> {
		return this.userService.getById(id);
	}

	@Get('/getAll')
	async getAll() : Promise<User[]> {
		return this.userService.getAll();
	}
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('new')
	async newUser(): Promise<void> {
		this.usersService.newUser("user@ElementInternals.fr", "password");
	}

	@Post()
	connection(@Body() user: User){
		console.log(user);
		this.usersService.connection("user@ElementInternals.fr", "password");
	}

	@Get('list')
	findAll(): Promise<User[]> {
		return this.usersService.findAll();
	}
}

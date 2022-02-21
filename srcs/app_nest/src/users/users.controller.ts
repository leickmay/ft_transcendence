import { Controller, Get, Post } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('id')
	getHello(): Promise<User> {
		return this.usersService.findOne(1);
	}

	@Get('new')
	setHello(): Promise<void> {
		return this.usersService.insert(42);
	}
}

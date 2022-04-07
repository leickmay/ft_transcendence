import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/')
	async new(@Body() user: CreateUserDto): Promise<GetUserDto> {
		return this.userService.create(user);
	}

	@Delete('id/:id')
	async remove(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Get('/id/:id')
	async getById(@Param('id') id: number) : Promise<GetUserDto> {
		return this.userService.getById(id);
	}

	@Get('/all')
	async getAll() : Promise<GetUserDto[]> {
		return this.userService.getAll();
	}

	@Get('/profile')
	async getProfile(@Request() req) : Promise<User> {
		return this.userService.getProfile(req.user);
	}

	@Get('/addfriend/:login')
	async addFriend(@Request() req, @Param('login') login: string) {
		await this.userService.addFriend(req, login);
	}

	@Get('/friends')
	async getFriends(@Request() req) : Promise<User[]> {
		const users = await this.userService.getFriends(req);
		return users;
	}
	


}

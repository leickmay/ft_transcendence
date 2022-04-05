import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
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
		let dto: GetUserDto = await this.userService.getById42(id);
		if (!dto)
			return null;
		return dto;
	}

	@Get('/')
	async getAll() : Promise<GetUserDto[]> {
		return this.userService.getAll();
	}


}

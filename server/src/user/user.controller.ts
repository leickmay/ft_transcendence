import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUserDto } from './dto/getUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor() {}

	@Get('/')
	async index(@Req() request) : Promise<GetUserDto> {
		return request.user;
	}
}

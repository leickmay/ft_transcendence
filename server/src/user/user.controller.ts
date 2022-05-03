import { ClassSerializerInterceptor, Controller, Get, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './user.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor() {}

	@UseInterceptors(ClassSerializerInterceptor)
	@SerializeOptions({
		groups: ['owner'],
	})
	@Get('/')
	async index(@Req() request) : Promise<User> {
		return request.user;
	}
}

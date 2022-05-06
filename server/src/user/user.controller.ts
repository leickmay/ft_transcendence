import { ClassSerializerInterceptor, Controller, Get, Req, SerializeOptions, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/auth/filters/totp-exception.filter';
import { TwoFactorJwtAuthGuard } from 'src/auth/guards/two-factor-jwt-auth.guard';
import { User } from './user.entity';

@UseGuards(TwoFactorJwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
	constructor() {}

	@SerializeOptions({
		groups: ['owner'],
	})
	@Get('/')
	async index(@Req() request) : Promise<User> {
		return request.user;
	}
}

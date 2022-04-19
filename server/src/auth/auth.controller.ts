import { Controller, Get, Param, UseGuards, Res, HttpException, HttpStatus, Query, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

/**
 * @deprecated
 */
@Controller()
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService
	) {}

	@Get('/login')
	async debugLogin(@Query('id') id: number, @Res() response: Response) {
		this.userService.get(id)
		.then((user) => {
			const payload = {
				id: user.id,
				login: user.login,
			};

			response.cookie('access_token', this.jwtService.sign(payload)).send({ success: true });
		})
		.catch(() => {
			response.status(404).send('User not found');
		});
	}
}

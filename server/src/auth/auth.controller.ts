import { Body, Controller, ForbiddenException, Get, NotFoundException, Post, Query, Req, Res, UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as OTPAuth from 'otpauth';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * @deprecated
 */
@Controller()
export class AuthController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
		private jwtService: JwtService,
	) {}

	@Post('/login')
	async login(@Body('code') code: string, @Res() response: Response): Promise<void> {
		if (code) {
			const token = await this.authService.login(code);
			response.cookie('access_token', token, {
				sameSite: 'lax',
			}).send(token);
		} else {
			throw new UnprocessableEntityException();
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post('/login/totp')
	async totp(@Body('token') token: string, @Req() request, @Res() response: Response): Promise<void> {
		let totp = new OTPAuth.TOTP({
			issuer: 'Stonks Pong 3000',
			label: request.user.login,
			algorithm: 'SHA1',
			digits: 6,
			period: 30,
			secret: request.user.totp,
		});
	
		if (token && totp.validate({token}) == 0) {
			const token = await this.authService.makeJWTToken(request.user, false);

			response.cookie('access_token', token, {
				sameSite: 'lax',
			}).send(token);
		} else {
			throw new ForbiddenException();
		}
	}
}

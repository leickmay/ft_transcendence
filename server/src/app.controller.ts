import { Body, Controller, Get, Post, UseGuards, Request, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { response, Response } from 'express';


@Controller()
export class AppController {
	constructor(private readonly appService: AppService,
		private authService: AuthService
		) {}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Get('/code/:id')
	async code(@Param('id') id: string, @Res() response : Response) {
		const token = await this.authService.login(id);

		response
			.cookie('access_token', token, {
				//httpOnly: true,
				//domain: 'localhost',
				//expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
			})
			.send({ success: true });
	  //return token;
	}

}

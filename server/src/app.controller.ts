import { Body, Controller, Get, Post, UseGuards, Request, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';


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

	@Post('/code/:id')
	async code(@Param('id') id: string) {
	  return this.authService.login(id);
	}

}

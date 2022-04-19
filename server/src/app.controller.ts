import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
	constructor(
		private authService: AuthService,
	) {}

	@Get('/code/:id')
	async code(@Param('id') id: string, @Res() response: Response) {
		const token = await this.authService.login(id);

		response.cookie('access_token', token.access_token).send({ success: true });
	}
}

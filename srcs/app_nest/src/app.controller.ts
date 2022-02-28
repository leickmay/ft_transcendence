import { Controller, Get, Redirect } from '@nestjs/common';
import { get } from 'http';
import { url } from 'inspector';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

//	@Get()
//	@Redirect(
//		'http://localhost:3000'
//	)
//	async home() {}

//	@Get('/api/*')
//		@Redirect(
//			'https`://google.com/*'
//		)
//	async api() {
//		console.log('api...');
//	}
}


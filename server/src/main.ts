import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const httpsOptions = {
		key: fs.readFileSync('/etc/ssl/private/private-key.key'),
		cert: fs.readFileSync('/etc/ssl/certs/public-certificate.pem'),
	};
	const server = express();
	const app = await NestFactory.create(
		AppModule,
		new ExpressAdapter(server),
	);
	app.enableCors();
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle('Transcendence')
		.setVersion('1.0')
		.addTag('users')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('', app, document);
	await app.init();
	http.createServer(server).listen(80);
	https.createServer(httpsOptions, server).listen(443);
}

bootstrap();

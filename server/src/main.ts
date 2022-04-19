import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookierParser from 'cookie-parser';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { AppModule } from './app.module';

async function bootstrap() {
	const app: NestExpressApplication = await initNest();

	addSwagger(app);

	await app.init();
	start(app);
}

async function initNest(): Promise<NestExpressApplication> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app.enableCors();
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());
	app.use(cookierParser());

	return app;
}

function addSwagger(app: NestExpressApplication) {
	const config = new DocumentBuilder()
		.setTitle('Transcendence')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('', app, document);
}

function start(app: NestExpressApplication) {
	const httpsOptions = {
		key: fs.readFileSync('/etc/ssl/private/private-key.key'),
		cert: fs.readFileSync('/etc/ssl/certs/public-certificate.crt'),
	};

	http.createServer(app.getHttpAdapter().getInstance()).listen(80);
	https.createServer(httpsOptions, app.getHttpAdapter().getInstance()).listen(443);
}

bootstrap();

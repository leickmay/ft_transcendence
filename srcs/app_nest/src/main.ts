import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import * as express from 'express';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
//import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/private-key.pem'),
    cert: fs.readFileSync('./secrets/public-certificate.pem'),
  };

  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  app.enableCors();
// app.use('/api', createProxyMiddleware({
//		target: 'http://172.18.0.5:3000',
//		changeOrigin: false,
//		pathRewrite: {
//			[`^/api`]: ''
//		}
// }));
  await app.init();

  http.createServer(server).listen(3080);
  https.createServer(httpsOptions, server).listen(3443);
}

bootstrap();

//let request = await fetch("/users/list");
//let users = await request.json();

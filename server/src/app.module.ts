import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Image } from './images/image.entity';
import { ImageModule } from './images/image.module';
import { EventsModule } from './socket/events.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: process.env.DB_CONNECTION as any,
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [User, Image],
			synchronize: true,
		}),
		ConfigModule.forRoot(),
		UserModule,
		AuthModule,
		EventsModule,
		ImageModule
	],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './socket/events.module';
import { Image } from './images/image.entity';
import { ImageModule } from './images/image.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Stats } from './stats/stats.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: process.env.DB_CONNECTION as any,
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT || '80'),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [User, Image, Stats],
			synchronize: true,
		}),
		ConfigModule.forRoot(),
		UserModule,
		AuthModule,
		EventsModule,
		ImageModule
	],
})
export class AppModule {}

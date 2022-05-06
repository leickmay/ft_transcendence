import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './chat/events.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: 5432,
			username: 'admin',
			password: 'password',
			database: 'my_db',
			entities: [User],
			synchronize: true,
		}),
		UserModule,
		AuthModule,
		EventsModule,
	],
	providers: [AppService],
})
export class AppModule {}

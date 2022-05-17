import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './Events/events.module';
import { GameEventsModule } from './game/gameEvents.module';
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
		GameEventsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

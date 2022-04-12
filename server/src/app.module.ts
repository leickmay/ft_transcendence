import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Friendship } from './friendship/friendship.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { EventsModule } from './chat/events.module';

@Module({
  imports: [
	  TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'postgres',
		port: 5432,
		username: 'admin',
		password: 'password',
		database: 'my_db',
		entities: [User, Friendship],
		synchronize: true,
	  }),
	  UserModule,
	  AuthModule,
	  EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

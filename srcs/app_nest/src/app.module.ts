import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';

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
	  UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

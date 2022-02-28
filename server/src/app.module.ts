import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
	  TypeOrmModule.forRoot({
		type: 'postgres',
		host: 'postgres',
		port: 5432,
		username: 'admin',
		password: 'password',
		database: 'my_db',
		entities: [],
		synchronize: true,
	  })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

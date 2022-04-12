import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from 'src/friendship/friendship.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]),
				TypeOrmModule.forFeature([Friendship])],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}

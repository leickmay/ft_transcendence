import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import ImageFileService from 'src/images/image.service';
import ImageFile from 'src/images/image.entity';
import { ImageFileModule } from 'src/images/image.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		ImageFileModule
	],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}

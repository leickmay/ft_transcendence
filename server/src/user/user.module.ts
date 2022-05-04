import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

import ImageFileService from 'src/imageFile/imageFile.service';
import ImageFile from 'src/imageFile/imageFile.entity';
import { ImageFileModule } from 'src/imageFile/imageFile.module';

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

import { ClassSerializerInterceptor, Controller, Get, NotFoundException, Param, Post, Req, Res, SerializeOptions, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/auth/filters/totp-exception.filter';
import { TwoFactorJwtAuthGuard } from 'src/auth/guards/two-factor-jwt-auth.guard';
import { ApiFile } from 'src/images/decorators/api-file.decorator';
import { fileMimetypeFilter } from 'src/images/filters/file-mimetype-filter';
import { Readable } from 'stream';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseGuards(TwoFactorJwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@SerializeOptions({
		groups: ['owner'],
	})
	@Get('/')
	async index(@Req() request) : Promise<User> {
		return request.user;
	}

	@Post('/avatar')
	@ApiFile('avatar', true, {
		fileFilter: fileMimetypeFilter('image'),
		limits: {
			fileSize: 2000000,
		},
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request) {
		return await this.userService.setAvatar(request.user, {
			avatar: {
				content: file.buffer,
				filename: file.originalname,
			},
		});
	}

	@Get('/avatar/:login')
	async getAvatar(@Res({ passthrough: true }) response: Response, @Param('login') login:string ) {
		const user: User = await this.userService.getByLogin(login);
		const avatar = await user.avatar;

		console.log(user);

		if (!avatar)
			throw new NotFoundException();

		const stream = Readable.from(avatar.content);

		response.set({
			'Content-Disposition': `inline; filename="${avatar.filename}"`,
			'Content-Type': 'image' // TYPE image/??? --------------------------------------------------
		})

		return new StreamableFile(stream);
	}
}

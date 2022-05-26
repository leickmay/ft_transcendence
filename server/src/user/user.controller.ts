import { ClassSerializerInterceptor, Controller, forwardRef, Get, Inject, NotFoundException, Param, Post, Req, Res, SerializeOptions, SetMetadata, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/auth/filters/totp-exception.filter';
import { TwoFactorJwtAuthGuard } from 'src/auth/guards/two-factor-jwt-auth.guard';
import { EventsService } from 'src/socket/events.service';
import { ApiFile } from 'src/images/decorators/api-file.decorator';
import { fileMimetypeFilter } from 'src/images/filters/file-mimetype-filter';
import { Readable } from 'stream';
import { User } from './user.entity';
import { UserService } from './user.service';
import { PacketPlayOutUserUpdate } from 'src/socket/packets/PacketPlayOutUserUpdate';

export const Public = () => SetMetadata("isPublic", true );

@UseGuards(TwoFactorJwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
	constructor(
		private userService: UserService,
		@Inject(forwardRef(() => EventsService))
		private eventsService: EventsService,
	) {}

	@SerializeOptions({
		groups: ['owner'],
	})
	@Get('/')
	async index(@Req() request) : Promise<User> {
		return request.user;
	}

	@Post('/avatar')
	@ApiFile('avatar', true, {
		fileFilter: fileMimetypeFilter('image/png','image/jpeg'),
		limits: {
			fileSize: 2000000,
		},
	})
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request) {
		let user: User = request.user;

		await this.userService.setAvatar(user, {
			avatar: {
				content: file.buffer,
				filename: file.originalname,
			},
		});
		this.eventsService.getServer().emit('user', new PacketPlayOutUserUpdate({
			id: user.id,
			avatar: user.getAvatarUrl() + '?r=' + Math.floor(Math.random() * 1000), // avoid same url for image reload
		}));
	}

	@Public()
	@Get('/avatar/:login')
	async getAvatar(@Param('login') login: string, @Res({ passthrough: true }) response: Response) {
		const user: User = await this.userService.getByLogin(login, {
			relations: ['avatar']
		});
		const avatar = await user.avatar;

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

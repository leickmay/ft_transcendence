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
import { Image } from 'src/images/image.entity';

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

		if (!user)
			return;

		await this.userService.setAvatar(user, {
			avatar: {
				content: file.buffer,
				filename: file.originalname,
			},
		});
		let connectedUser = this.eventsService.getUserById(user.id);
		if (connectedUser)
			connectedUser.avatarId = user.avatarId;
		this.eventsService.getServer()?.emit('user', new PacketPlayOutUserUpdate({
			id: user.id,
			avatar: user.getAvatarUrl(),
		}));
	}

	@Public()
	@Get('/avatar/:id')
	async getAvatar(@Param('id') id: number, @Res({ passthrough: true }) response: Response) {
		const avatar = await Image.findOneBy({id});

		if (!avatar)
			throw new NotFoundException();

		const stream = Readable.from(avatar.content);

		response.set({
			'Content-Disposition': `inline; filename="${avatar.filename}"`,
			'Content-Type': 'image'
		})

		return new StreamableFile(stream);
	}
}

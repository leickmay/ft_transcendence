import { ClassSerializerInterceptor, Controller, Get, Param, Post, Req, Res, SerializeOptions, StreamableFile, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/auth/filters/totp-exception.filter';
import { TwoFactorJwtAuthGuard } from 'src/auth/guards/two-factor-jwt-auth.guard';
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

	@Post('/changelogin/:newLogin')
	async changeLogin(@Param('newLogin') newLogin: string, @Req() request) {
		await this.userService.setName(request.user, newLogin);
	}

	@Post('/uploadimage')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request) {
	  console.log("file : ", file);
	  console.log("user : ", request.user.login);
	  return this.userService.addAvatar(request.user.login, file.buffer, file.originalname);
	}

	@Get('/avatar/:login')
	async getAvatar(@Res({ passthrough: true }) response: Response, @Param('login') login:string ) {
		const user: User = await this.userService.getByLogin(login);
		const avatar = await this.userService.getAvatar(user);

		const stream = Readable.from(avatar.data);

        response.set({
            'Content-Disposition': `inline; filename="${avatar.filename}"`,
            'Content-Type': 'image'
        })

        return new StreamableFile(stream);
	}
}

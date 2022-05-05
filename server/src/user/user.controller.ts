import { Body, Controller, Delete, Get, Param, Post, Req, Res, StreamableFile, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Response } from "express";

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('/')
	async index(@Req() request) : Promise<GetUserDto> {
		return request.user;
	}

	@Post('/')
	async store(@Body() user: CreateUserDto): Promise<GetUserDto> {
		return this.userService.create(user);
	}

	@Get('/id/:id')
	async show(@Param('id') id: number) : Promise<GetUserDto> {
		return this.userService.get(id);
	}

	@Get('/login/:login')
	async showLogin(@Param('login') login: string) : Promise<GetUserDto> {
		return this.userService.getByLogin(login);
	}

	@Delete('/:id')
	async delete(@Param('id') id: number): Promise<void> {
		return this.userService.remove(id);
	}

	@Post('/changelogin/:newLogin')
	async changeLogin(@Param('newLogin') newLogin: string, @Req() request) {
		await this.userService.newLogin(request.user.login, newLogin);
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

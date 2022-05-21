import { Injectable } from '@nestjs/common';
import * as OTPAuth from 'otpauth';
import { Image } from 'src/images/image.entity';
import { BaseEntity, FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserAvatarDto } from './dto/update-user-avatar.dto';
import { UpdateUserNameDto } from './dto/update-user-name.dto';
import { User } from './user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class UserService {
	constructor() {}

	async create(data: CreateUserDto) : Promise<User> {
		return await User.create(data as any).save();
	}

	async get(id: number) : Promise<User> {
		return await User.findOneBy({id});
	}

	async getById42(id42: number) : Promise<User> {
		return await User.findOneBy({id42});
	}

	async getByLogin(login: string, options?: FindOneOptions<User>) : Promise<User> {
		return await User.findOne({
			...options,
			where: {
				login: login,
			}
		});
	}

	async setName(user: User, data: UpdateUserNameDto): Promise<User> {
		// to change when typeorm update to 0.3.7
		return await User.merge(user, data as any).save();
	}

	async toggleTotp(user: User): Promise<string | undefined> {
		let totp: OTPAuth.TOTP;
		if (!user.totp) {
			totp = new OTPAuth.TOTP({
				issuer: 'Stonks Pong 3000',
				label: user.login,
				algorithm: 'SHA1',
				digits: 6,
				period: 30,
			});
		}
		user.totp = totp?.secret.base32 || null;
		await user.save();
		return totp?.toString();
	}

	async setAvatar(user: User, data: UpdateUserAvatarDto): Promise<User> {
		user.avatar = Promise.resolve(await Image.merge(await user.avatar || new Image(), data.avatar).save());
		return await user.save();
	}
}

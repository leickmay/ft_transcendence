import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ImageFileService from 'src/imageFile/imageFile.service';
import { Connection, Repository } from 'typeorm';
import { AlreadyExistsException } from './alreadyExists.exception';
import { CreateUserDto } from './dto/createUser.dto';

import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly imageFileService: ImageFileService,
		private connection: Connection
	) {}

	async all(): Promise<User[]> {
		return await this.userRepository.find();
	}

	async create(user: CreateUserDto): Promise<User> {
		return await this.userRepository.save(user);
	}

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	async remove(id: number): Promise<void> {
		await this.userRepository.delete(id);
	}

	async get(id: number): Promise<User> {
		return await this.userRepository.findOne(id, {
			relations: ['friends'],
		});
	}

	async getById42(id42: number) : Promise<User> {
		return await this.userRepository.findOne({id42});
	  }

	async getByLogin(login: string) : Promise<User> {
		return await this.userRepository.findOne({login});
	}

	async newLogin(login: string, newLogin: string) {
		const user: User = await this.getByLogin(login);
		user.login = newLogin;
		try {
			await this.userRepository.save(user);
		}
		catch{
			throw new AlreadyExistsException();
		}
		
	}

	/*async setNewAvatar(file: Express.Multer.File, login: string) {
		const user: User = await this.getByLogin(login);
		user.avatar = file.buffer.toString();
		await this.userRepository.save(user);
	}
*/
	async addAvatar(login: string, imageBuffer: Buffer, filename: string) {
		const queryRunner = this.connection.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const user = await queryRunner.manager.findOne(User, login);
			const currentAvatarId = user.avatar.id;
			const avatar = await this.imageFileService.uploadImageFile(imageBuffer, filename, queryRunner);

			await queryRunner.manager.update(User, login, {
				avatar: avatar,
			})

			if (currentAvatarId) {
				await this.imageFileService.deleteImageFile(currentAvatarId, queryRunner);
			}

			await queryRunner.commitTransaction();

			return avatar;
		} catch {
			await queryRunner.rollbackTransaction();
			throw new InternalServerErrorException();
		} finally {
			await queryRunner.release();
		}

		//const avatar = await this.imageFileService.uploadImageFile(imageBuffer, filename);
		//let user: User = await this.getByLogin(login);
		//user.avatar = avatar;
		//this.userRepository.save(user);
		//return avatar;
	  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
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
}

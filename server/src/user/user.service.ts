import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async all(): Promise<GetUserDto[]> {
		return await this.userRepository.find();
	}

	async create(user: CreateUserDto): Promise<GetUserDto> {
		const newUser: User = User.create(user);
		await this.userRepository.save(newUser);
		return (newUser);
	}

	async remove(id: number): Promise<void> {
		const user: User = await this.userRepository.findOne(id);
		await this.userRepository.remove(user);
	}

	async get(id: number): Promise<GetUserDto> {
		return await this.userRepository.findOne(id);
	}

	async getById42(id: number) : Promise<GetUserDto> {
		const user = await this.userRepository.findOne({
			id42: id
		});
		return user;
	  }

	async getByLogin(login: string) : Promise<User> {
		const user = await this.userRepository.findOne ({
			login: login
		})
		return user;
	}
}

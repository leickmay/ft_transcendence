import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async create(user: CreateUserDto): Promise<User> {
		const newUser: User = User.create(user);
		await this.userRepository.save(newUser);
		return (newUser);
	}

	async remove(id: number): Promise<void> {
		const user: User = await this.userRepository.findOne(id);
		await this.userRepository.remove(user);
	}

	async getById(id: number): Promise<User> {
		return await this.userRepository.findOne(id);
	}

	async getAll(): Promise<User[]> {
		return await this.userRepository.find();
	}
}

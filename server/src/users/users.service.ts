import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async create(user: CreateUserDto): Promise<User> {
		const newUser = User.create(user);
		try {
			await this.usersRepository.save(newUser);
		} catch (error) {
			console.log("ERROR !!!");
		}
		delete newUser.password;
		return (newUser);
	}

	async remove(id: number): Promise<void> {
		const user = await this.usersRepository.findOne(id);
		await this.usersRepository.remove(user);
	}

	async getById(id: number): Promise<User> {
		const user = await this.usersRepository.findOne(id);
		delete user.password;
		return user;
	}
}

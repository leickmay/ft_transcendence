import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
	) {}

	async connection(email: string, password: string): Promise<boolean> {
		const tmp = await this.usersRepository.findOne({
			email: email
		});
		if (tmp != undefined && tmp.password === password)
		{
			tmp.isConnected = true;
			await this.usersRepository.save(tmp);
			console.log("TRUE");
			return (true);
		}
		console.log("FALSE");
		return (false);
	}

	async newUser(myEmail: string, myPassword: string): Promise<void> {
		await this.usersRepository.insert({
			email: myEmail,
			password: myPassword
		});
	}

	async delUserById(id: string): Promise<void> {
		await this.usersRepository.delete(id);
	}

	findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}
}

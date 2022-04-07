import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AuthService } from 'src/auth/auth.service';
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

	async create(user: CreateUserDto): Promise<GetUserDto> {
		const newUser: User = User.create(user);
		await this.userRepository.save(newUser);
		return (newUser);
	}

	async remove(id: number): Promise<void> {
		const user: User = await this.userRepository.findOne(id);
		await this.userRepository.remove(user);
	}

	async getById(id: number): Promise<GetUserDto> {
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

	async getAll(): Promise<GetUserDto[]> {
		return await this.userRepository.find();
	}

	async getProfile(req : any) : Promise<User> {
		return await this.userRepository.findOne(req.id);
	}

	async addFriend(req: any, login: string) {
		const user = await this.getProfile(req);
		const friend = await this.getByLogin(login);
		console.log("friend user : ", friend);
		const post = await this.userRepository.findOne(user.id, {relations: ["following"]});
		post.following.push(friend);
		await this.userRepository.save(post);
		const post2 = await this.userRepository.findOne(friend.id, {relations: ["followers"]});
		post2.followers.push(user);
		await this.userRepository.save(post2)
		
	}

	async getFriends(req: any): Promise<User[]> {
		const user = await this.getProfile(req);
		console.log(user);

		const users = this.userRepository.find({ 
			where: {
				login: user.login,
			},
			relations: ["friends"]});
		return users;
	} 

}

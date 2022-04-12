import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppController } from 'src/app.controller';
import { AuthService } from 'src/auth/auth.service';
import { NewFriendshipDto } from 'src/friendship/dto/newFriendship.dto';
import { Friendship } from 'src/friendship/friendship.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,

		@InjectRepository(Friendship)
		private friendshipRepository: Repository<Friendship>,
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
		console.log("friend login : ", login);
		try {
			const friend = await this.getByLogin(login);
			console.log("friend user : ", friend);
			const post: NewFriendshipDto = {
				asked: friend.id,
				askedBy: user.id,
				isValid: false
			};

			/*const pouic = await this.userRepository
    		.createQueryBuilder()
    		.select("user")
    		.from(User, "user")
    		.where("user.id = :id", { id: 1 })
    		.getOne()

			console.log("pouic : ", pouic);*/

			const lol = await this.friendshipRepository
			.createQueryBuilder()
			.select("friendship")
			.from(Friendship, "friendship")
			.where("friendship.askedBy = :id", {id: user.id})
			.andWhere("friendship.asked = :fid", {fid: friend.id})
			.getOne();

			console.log("lol : ", lol);

			if (!lol)
			{
				const newFriendship: Friendship = Friendship.create(post);
				await this.friendshipRepository.save(newFriendship); 
			}

			/*const alreadyExist = await this.friendshipRepository
										.createQueryBuilder("friendship")
										.where("friendship.askedBy = :user", {user})
										.andWhere("friendship.asker = :friend", {friend});
			console.log("already : ", alreadyExist);*/
			
			//const post = await this.userRepository.findOne(user.id, {relations: ["following"]});
			//console.log("post : ", post);
			//post.following.push(friend);
			//await this.userRepository.save(post);
			/*const post2 = await this.userRepository.findOne(friend.id, {relations: ["followers"]});
			console.log("post2 : ", post2);
			post2.followers.push(user);
			await this.userRepository.save(post2)*/
		}
		catch{
			console.log("ERROR - friend doesn't exist");
		}
		
		
		
	}

	async getFriends(req: any): Promise<User[]> {
		const user = await this.getProfile(req);
		console.log(user);

		const users = this.userRepository.find({ 
			relations: ["following"]});
		return users;
	} 

	async getPendingFriends(req: any)/*: Promise<User[]>*/ {
		const user = await this.getProfile(req);

		const pendingIds  = await this.friendshipRepository
			.createQueryBuilder()
			.select("friendship")
			.from(Friendship, "friendship")
			.where("friendship.asked = :id", {id: user.id})
			.andWhere("friendship.isValid = :fid", {fid: "false"})
			.getMany();
		
		console.log("pending ids : ", pendingIds);
		console.log("pendingid[0] : ", pendingIds[0].askedBy);
		let friends: User[];
		for (let i: number = 0; i < pendingIds.length; i++)
		{
			console.log(" coucou i : ", i);
			friends[i] = await this.userRepository
			.createQueryBuilder()
			.select("user")
			.from(User, "user")
			.where("user.id = :id", {id: pendingIds[i].askedBy})
			.getOne();
			console.log("friends[", i, "] : ", friends[i]);
		}
		/*friends = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.id = :id", {id: pendingIds[0].askedBy})
		.getOne();
		console.log("friends[", 0, "] : ", friends);*/

		//console.log("friends : ", friends);
		/*
		const friends = await this.userRepository
		.createQueryBuilder()
		.select("user")
		.from(User, "user")
		.where("user.id = :id", {id: user.id})
		.andWhere("friendship.isValid = :fid", {fid: "false"})
		.getMany();
		*/

	}

}

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';
import { User } from './users.entity';

export interface inX {
	access_token: string;
	expires_in: number;
	created_at: number;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>,
		private httpService: HttpService
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

	async connection(myCode: string): Promise<string> {

	const base_url = "https://api.intra.42.fr/oauth/token"
	console.log('code', myCode);
	
	let tonq = {
		grant_type: "authorization_code",
		client_id: "32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a",
		client_secret: "dfe506a4d179da98961261974e2ccb7dbc23f131de64890281224d8d75d78783",
		redirect_uri: "http://127.0.0.1:3000/loading",
		code: myCode
	}

	let ret : string;
	await axios({
		method: "post",
		url: base_url,
		data: tonq,
		headers: {
			"content-type": "application/json",
		},
	})
	.then(function(res) {
		ret = res.data.access_token;
		console.log("retour : ", res.data);
	})
	.catch((err) => {});

	console.log("ret : ", ret);

		return (ret);
	}
}

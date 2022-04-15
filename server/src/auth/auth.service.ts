import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	async get42Token(authCode: string): Promise<string> {
		const base_url = 'https://api.intra.42.fr/oauth/token';

		const params = {
			grant_type: 'authorization_code',
			client_id: '32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a',
			client_secret: 'dfe506a4d179da98961261974e2ccb7dbc23f131de64890281224d8d75d78783',
			redirect_uri: 'http://127.0.0.1:80/loading',
			code: authCode,
		};

		let token: string;

		await axios({
			method: 'post',
			url: base_url,
			data: params,
			headers: {
				'content-type': 'application/json',
			},
		})
		.then(function (res) {
			token = res.data.access_token;
		})
		.catch((err) => {
			console.log(err);
		});
		return token;
	}

	async validateUser(authCode: string): Promise<any> {
		const token = await this.get42Token(authCode);
		const api_endpoint = 'https://api.intra.42.fr/v2';

		let name: string;
		let data: any;

		await axios({
			method: 'get',
			url: api_endpoint + '/me',
			headers: {
				authorization: 'Bearer ' + token,
			},
		})
		.then(function (res) {
			name = res.data.usual_full_name;
			data = res.data;
		})
		.catch((err) => {
			console.log(err);
		});

		let tmpUser = await this.userService.getById42(data.id);
		
		if (!tmpUser) {
			await this.userService.create({
				"id42": data.id,
				"name": data.displayname,
				"login": data.login,
				"avatar": data.image_url
			});
	
			tmpUser = await this.userService.getById42(data.id);
		}
		return tmpUser;
	}

	verifyJwt(token: string) {
		return this.jwtService.verify(token);
	}

	async login(code: string) {
		const user = await this.validateUser(code);
		const payload = {
			id: user.id,
			login: user.login,
		};

		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}

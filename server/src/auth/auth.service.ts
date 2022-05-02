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
			client_id: process.env.API42_UID,
			client_secret: process.env.API42_SECRET,
			redirect_uri: process.env.API42_REDIRECT,
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

		let response = await axios({
			method: 'get',
			url: api_endpoint + '/me',
			headers: {
				authorization: 'Bearer ' + token,
			},
		});
		let data = response.data;
		let tmpUser = await this.userService.getById42(data.id);
		
		if (!tmpUser) {
			tmpUser = await this.userService.create({
				'id42': data.id,
				'name': data.displayname,
				'login': data.login,
				'avatar': data.image_url
			});
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

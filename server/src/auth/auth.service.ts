import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
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

	async validateUser(authCode: string): Promise<User> {
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
				'intra_picture': data.image_url
			});
		}
		return tmpUser;
	}

	verifyJwt(token: string): any {
		return this.jwtService.verify(token);
	}

	makeJWTToken(user: User, totp: boolean = true): string {
		const payload = {
			id: user.id,
			login: user.login,
			restricted: !!user.totp && totp
		};

		return this.jwtService.sign(payload);
	}

	async login(code: string): Promise<string> {
		const user = await this.validateUser(code);
		
		return this.makeJWTToken(user);
	}
}

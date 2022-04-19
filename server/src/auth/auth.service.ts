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

		console.log("auth code : ", authCode);
        const params = {
            grant_type: 'authorization_code',
            client_id:
              '0f3b46da8a8d75d766c4c3af8cc92a0c522cc646686afbe32e950c9d61506951',
            client_secret:
              '4198269eb067e672120f15893be15670791758cc5a34d75351630bfa11562c8c',
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
              console.log('retour get42Token : ', res.data);
            })
            .catch((err) => {
				console.log(err);
			});
        
        console.log('token : ', token);
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
			console.log('name : ', res.data.usual_full_name);
			console.log('data : ', data.id);
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
		  
		  console.log("tmp user : ", tmpUser);

      return tmpUser;
      
    }

    async login(code: string) {
      const user = await this.validateUser(code);
      const payload = { username: user.login, sub: user.id42};
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
}

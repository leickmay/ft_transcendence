import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
    async get42Token(authCode: string): Promise<string> {
        const base_url = 'https://api.intra.42.fr/oauth/token';

        const params = {
            grant_type: 'authorization_code',
            client_id:
              '32e445666f212da52b3a7811bf1ff13d37cfb105f4870eb38365337172af351a',
            client_secret:
              'dfe506a4d179da98961261974e2ccb7dbc23f131de64890281224d8d75d78783',
            redirect_uri: 'http://127.0.0.1:3000/loading',
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
            .catch((err) => {});
        
        console.log('token : ', token);
        return token;
    }
}

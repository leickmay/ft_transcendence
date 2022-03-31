import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { GetUserDto } from './dto/getUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
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

	async getById42(id42: number) : Promise<GetUserDto> {
		const user = await this.userRepository.findOne({ id42 });
		return user;
	  }

	async getAll(): Promise<GetUserDto[]> {
		return await this.userRepository.find();
	}

	async connection(myCode: string): Promise<GetUserDto> {
		const api_endpoint = 'https://api.intra.42.fr/v2';
		const auth = new AuthService();
	
		const token = await auth.get42Token(myCode);
		console.log('ret : ', token);
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
	
		  console.log('data.campus.city : ', data.campus[0].name);
	
	
	
		  let tmpUser = await this.getById42(data.id);
	
		
		  
		  if (!tmpUser) {
			await this.create({
			  "id42": data.id,
			  "name": data.displayname,
			  "login": data.login,
			  "avatar": data.image_url
			});
	
			tmpUser = await this.getById42(data.id);
		  }
		  
		  console.log("tmp user : ", tmpUser);
	
		return tmpUser;
	  }
}

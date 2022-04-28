import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { User } from '../user.entity';

export class GetUserDto {
	@ApiProperty()
	id: number;
	
	@ApiProperty()
	id42: number;
	
	@ApiProperty()
	name: string;

	@ApiProperty()
	login: string;

	@ApiProperty()
	avatar: string;

	@ApiProperty()
	friends?: Promise<GetUserDto[]>;
}

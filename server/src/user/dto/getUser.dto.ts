import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}

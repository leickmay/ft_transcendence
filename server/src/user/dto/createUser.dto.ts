import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty()
	id42: number;

	@ApiProperty()
	@MaxLength(50)
	name: string;

	@ApiProperty()
	login: string;

	@ApiProperty()
	avatar: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({
		description: 'Bonjour'
	})
	id42: number;

	@ApiProperty({
		description: '...'
	})
	@IsString()
	@MaxLength(50)
	name: string;

	@ApiProperty({
		description: 'tmtc'
	})
	@IsString()
	login: string;

	@ApiProperty({
		example: './path/to/avatar.png',
		description: '...'
	})
	@IsString()
	avatar: string;
}

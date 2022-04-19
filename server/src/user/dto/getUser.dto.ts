import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetUserDto {
	@ApiProperty({
		description: 'Bonjour'
	})
	id42: number;

	@ApiProperty()
	id: number;

	@ApiProperty({
		description: 'The name of the user',
	})
	@IsString()
	name: string;

	@ApiProperty({
		description: 'The login',
	})
	@IsString()
	login: string;

	@ApiProperty({
		example: './path/to/avatar.png',
		description: 'The avatar path',
	})
	@IsString()
	avatar: string;
}

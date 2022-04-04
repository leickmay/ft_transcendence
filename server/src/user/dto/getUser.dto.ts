import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class GetUserDto {
	@ApiProperty({
		example: '42id',
		description: 'Bonjour'
	})
	id42: number;

	@ApiProperty({
		example: 'name',
		description: '...'
	})
	@IsString()
	name: string;

	@ApiProperty({
		example: 'login',
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

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsMobilePhone, IsPhoneNumber, IsString } from "class-validator";

export class CreateUserDto {
	@ApiProperty({
		example: 'password',
		description: '...'
	})
	@IsString()
	password: string;

	@ApiProperty({
		example: 'name',
		description: '...'
	})
	@IsString()
	name: string;

	@ApiProperty({
		example: 'example@email.com',
		description: '...'
	})
	@IsEmail()
	mail: string;

	@ApiProperty({
		example: '0673840563',
		description: '...'
	})
	@IsMobilePhone()
	tel: string;

	@ApiProperty({
		example: './path/to/avatar.png',
		description: '...'
	})
	@IsString()
	avatar: string;
}
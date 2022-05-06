import { MaxLength } from 'class-validator';

export class CreateUserDto {
	id42: number;
	@MaxLength(50)
	name: string;
	login: string;
	intra_picture: string;
}

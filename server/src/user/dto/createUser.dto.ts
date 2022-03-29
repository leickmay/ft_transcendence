import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateUserDto {
	@IsInt()
	@ApiProperty({
		example: '42'
	})
	id: number;

	@IsString()
	@ApiProperty({
		example: 'Bob'
	})
	name: string;
}
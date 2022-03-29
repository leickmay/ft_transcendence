import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class GetUserDto {
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
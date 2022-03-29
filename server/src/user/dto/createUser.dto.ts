import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateUserDto {
	@IsString()
	@ApiProperty({
		example: 'Bob'
	})
	name: string;
}

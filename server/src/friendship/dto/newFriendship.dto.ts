import { ApiProperty } from "@nestjs/swagger";

export class NewFriendshipDto {
    @ApiProperty({
        example: 'michel',
        description: 'login of the asked friend',
    })
    asked: number;

    @ApiProperty({
        example: 'jacky',
        description: 'login of the friend asker',
    })
    askedBy: number;

    @ApiProperty({
        example: 'false',
        description: 'Only false on creation',
    })
    isValid: boolean;
}
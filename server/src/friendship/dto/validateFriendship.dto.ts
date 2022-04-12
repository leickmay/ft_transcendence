import { ApiProperty } from "@nestjs/swagger";

export class validateFrienshipDto {
    @ApiProperty({
        example: 'only true',
        description: 'the frienship as been validate by the asked one'
    })
    isValid: boolean;
}
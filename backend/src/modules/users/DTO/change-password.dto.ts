import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
            'Password must contain uppercase, lowercase, number, and special character',
    })
    newPassword: string;
}

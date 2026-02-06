import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    currentPassword?: string | null;

    @ApiProperty()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message:
            'Password must contain uppercase, lowercase, number, and special character',
    })
    newPassword: string;
}

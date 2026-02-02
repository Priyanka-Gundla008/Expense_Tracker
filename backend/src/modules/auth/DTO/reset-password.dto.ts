// src/auth/dto/reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'Token is required' })
    token: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
    @Matches(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })
    newPassword: string;
}

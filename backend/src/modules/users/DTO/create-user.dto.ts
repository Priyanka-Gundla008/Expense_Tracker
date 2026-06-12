import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsString,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {

  @ApiProperty({
    description: 'Name of the user',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name can contain only letters and spaces',
  })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters, include uppercase, lowercase, number & special character',
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;

  // OPTIONAL FIELDS

  @ApiPropertyOptional({ description: 'Mobile number' })
  @IsOptional()
  @IsString()
  mobile?: string;

  @ApiPropertyOptional({ description: 'Address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional({ description: 'Company name' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Department name' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'User working designation',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  designation: string;

  @ApiProperty({
    description: 'User accepted Terms & Conditions',
  })
  @IsBoolean()
  acceptedTerms: boolean;
}

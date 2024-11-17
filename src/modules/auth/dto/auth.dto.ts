import { IsString, IsEmail, IsNotEmpty, IsPhoneNumber, IsEnum, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles.enum';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'example@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one special character.',
  })
  password: string;

  @ApiProperty({
    description: 'Role of the user (must be one of the predefined roles)',
    example: Role.User,
  })
  @IsEnum(Role, { message: 'Role must be one of the predefined roles' })
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
  })
  @IsPhoneNumber(null)
  @IsNotEmpty()
  phone: string;
}

export class SignInDto {
    @ApiProperty({
      description: 'User email address',
      example: 'example@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({
      description: 'Password for the user account',
      example: 'P@ssw0rd!',
    })
    @IsString()
    @IsNotEmpty()
    password: string;
  }

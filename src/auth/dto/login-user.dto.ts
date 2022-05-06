import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsString({ message: 'The email must be a text string.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail(undefined, {
    message: 'The email is not valid.',
  })
  @MaxLength(255, {
    message: 'The email must not be longer than 127 characters.',
  })
  @MinLength(5, { message: 'Email must be greater than 5 characters.' })
  @ApiProperty({
    example: 'administrator@nestjs2022.com',
    description: 'User email',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  email: string;

  @IsString({ message: 'The password must be a text string.' })
  @MaxLength(1024, {
    message: 'The password must not be longer than 127 characters.',
  })
  @MinLength(5, { message: 'The password must be greater than 5 characters.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @ApiProperty({
    example: '123456',
    description: 'The users password',
    format: 'string',
    minLength: 5,
    maxLength: 1024,
  })
  readonly password: string;
}

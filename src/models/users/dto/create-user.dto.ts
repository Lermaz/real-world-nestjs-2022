import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'The role must be a text string.' })
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Administrator',
    description: 'The role for the User',
    format: 'string',
  })
  _rol: string;

  @IsString({ message: 'The first name must be a text string.' })
  @MaxLength(127, {
    message: 'The first name must not be less than 127 characters.',
  })
  @MinLength(3, {
    message: 'The first name must be greater than 3 characters.',
  })
  @IsNotEmpty({ message: 'The first name is required' })
  @ApiProperty({
    example: 'Jane Doe',
    description: 'The first name for the User',
    format: 'string',
    uniqueItems: true,
    minLength: 3,
    maxLength: 127,
  })
  readonly first_name: string;

  @IsString({ message: 'The last name must be a text string.' })
  @MaxLength(127, {
    message: 'The last name must not be less than 127 characters.',
  })
  @MinLength(3, { message: 'The last name must be greater than 3 characters.' })
  @IsNotEmpty({ message: 'The last name is required' })
  @ApiProperty({
    example: 'Jane Doe',
    description: 'The last name for the User',
    format: 'string',
    uniqueItems: true,
    minLength: 3,
    maxLength: 127,
  })
  readonly last_name: string;

  @IsString({ message: 'The email must be a text string.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail(undefined, {
    message: 'The email is not valid.',
  })
  @MaxLength(255, {
    message: 'The email must not be less than or equal to 255 characters.',
  })
  @MinLength(6, {
    message: 'Email must be greater than or equal to 6 characters.',
  })
  @ApiProperty({
    example: 'administrador@nestjs2022.com',
    description: 'User email',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  readonly email: string;

  @IsString({ message: 'You currently do not have the necessary permissions.' })
  @IsNotEmpty({
    message: 'Password must be greater than or equal to 5 characters.',
  })
  @MinLength(5, {
    message: 'Password must be greater than or equal to 5 characters.',
  })
  @MaxLength(1024, {
    message: 'The password must not be less than or equal to 127 characters.',
  })
  @ApiProperty({
    example: '123456',
    description: 'The users password',
    format: 'string',
    minLength: 5,
    maxLength: 1024,
  })
  password: string;
}

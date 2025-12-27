import { IsString, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @IsString({ message: "Username must be a string" })
  @MinLength(9, { message: "Username must be at least 9 characters" })
  @Matches(/^\S+$/, { message: "Username must not contain spaces" })
  readonly username: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(7, { message: "Password must be at least 7 characters" })
  @Matches(/^\S+$/, { message: "Password must not contain spaces" })
  readonly password: string;
}

import { IsString, MinLength, Matches } from 'class-validator';
export class Dtoregister {
  @IsString({ message: "Name must be a string" })
  @MinLength(2, { message: "Name must be at least 2 characters" })
  readonly name: string;
  
  @IsString({ message: "Username must be a string" })
  @MinLength(9, { message: "Username must be at least 9 characters" })
  @Matches(/^\S+$/, { message: "Name must not contain spaces" })
  readonly username: string;

  @IsString({ message: "password must be a string" })
  @MinLength(7, { message: "Password must be at least 7 characters" })
  @Matches(/^\S+$/, { message: "Name must not contain spaces" })
  readonly password: string;
}
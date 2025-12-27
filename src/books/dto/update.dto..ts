import { IsString, IsOptional, IsNumber, IsInt, Min } from "class-validator";

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stars?: string; 

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  reservationDuration?: number;
}

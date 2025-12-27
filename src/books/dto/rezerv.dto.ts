import { IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  bookId: number;


}

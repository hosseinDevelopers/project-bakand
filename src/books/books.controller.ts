import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateBookDto } from './dto/book.dto';
import { BookServis } from './books.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/rezerv.dto';
import { JwtAuthGuard } from '@/auth/jwt.guard';
import * as jwt from 'jsonwebtoken';
import { UpdateBookDto } from './dto/update.dto.';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookServis) {}

  @Post('postBook')
  async postBook(@Req() req, @Body() payload: CreateBookDto) {
    return this.booksService.postBook(req, payload);
  }

  @Get('search')
  async searchBooks(@Query('q') query: string) {
    return this.booksService.searchBooks(query);
  }

  @Get('all')
  async getAllBooks() {
    return this.booksService.getAllBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: number) {
    return this.booksService.getBookById(id);
  }

  @Post('reserve')
  async reserveBook(@Req() req, @Body() payload: CreateReservationDto) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No token provided');

    return this.booksService.reserveBook(authHeader, payload);
  }

  @Delete(':id')
  async deleteBook(@Req() req, @Param('id') id: number) {
    return this.booksService.deleteBookById(req, +id);
  }

  @Put(':id')
  async updateBook(
    @Req() req,
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const updatedBook = await this.booksService.updateBook(
      req,
      +id,
      updateBookDto,
    );
    if (!updatedBook) {
      throw new NotFoundException('Book not found');
    }
    return updatedBook;
  }

  @Get('reservations/active')
  async getMyActiveReservations(@Req() req) {
    const authHeader = req.headers.authorization;
    return this.booksService.getActiveUserReservations(authHeader);
  }
}

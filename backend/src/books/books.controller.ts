import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}


  @Get()
  async findAll(@Query('username') username?: string): Promise<Book[]> {
    if (username) {
      return this.booksService.findByUsername(username);
    }
    return this.booksService.findAll();
  }

  @Get('user/:username/current')
  async findCurrentRead(@Param('username') username: string): Promise<Book | null> {
    return this.booksService.findCurrentReadByUsername(username);
  }

  @Get('search/usernames')
  async searchUsernames(@Query('q') query: string): Promise<string[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return this.booksService.searchUsernames(query.trim());
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Post()
  async create(@Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.create(bookData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() bookData: Partial<Book>,
  ): Promise<Book> {
    return this.booksService.update(id, bookData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}


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
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('book/:book_id')
  async findByBook(@Param('book_id', ParseIntPipe) book_id: number): Promise<Comment[]> {
    return this.commentsService.findByBook(book_id);
  }

  @Get('book/:book_id/chapters')
  async getChapters(@Param('book_id', ParseIntPipe) book_id: number): Promise<string[]> {
    return this.commentsService.getChaptersForBook(book_id);
  }

  @Get('book/:book_id/chapter/:chapter')
  async findByBookAndChapter(
    @Param('book_id', ParseIntPipe) book_id: number,
    @Param('chapter') chapter: string,
  ): Promise<Comment[]> {
    return this.commentsService.findByBookAndChapter(book_id, chapter);
  }

  @Post()
  async create(@Body() commentData: Partial<Comment>): Promise<Comment> {
    return this.commentsService.create(commentData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() commentData: Partial<Comment>,
  ): Promise<Comment> {
    return this.commentsService.update(id, commentData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.commentsService.remove(id);
  }
}


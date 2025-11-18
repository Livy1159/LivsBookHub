import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findByBook(book_id: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { book_id },
      order: { created_at: 'ASC' },
    });
  }

  async findByBookAndChapter(book_id: number, chapter: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { book_id, chapter },
      order: { created_at: 'ASC' },
    });
  }

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentsRepository.create(commentData);
    return this.commentsRepository.save(comment);
  }

  async update(comment_id: number, commentData: Partial<Comment>): Promise<Comment> {
    await this.commentsRepository.update(comment_id, commentData);
    return this.commentsRepository.findOne({ where: { comment_id } });
  }

  async remove(comment_id: number): Promise<void> {
    await this.commentsRepository.delete(comment_id);
  }

  async getChaptersForBook(book_id: number): Promise<string[]> {
    const comments = await this.commentsRepository.find({
      where: { book_id },
      select: ['chapter'],
    });
    const chapters = [...new Set(comments.map(c => c.chapter))];
    return chapters.sort();
  }
}


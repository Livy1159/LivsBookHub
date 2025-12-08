import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findByUsername(username: string): Promise<Book[]> {
    return this.booksRepository.find({ where: { username } });
  }

  async searchUsernames(query: string): Promise<string[]> {
    const books = await this.booksRepository
      .createQueryBuilder('book')
      .select('DISTINCT book.username', 'username')
      .where('book.username LIKE :query', { query: `${query}%` })
      .orderBy('book.username', 'ASC')
      .limit(10)
      .getRawMany();
    
    return books.map((book: any) => book.username);
  }

  async findCurrentReadByUsername(username: string): Promise<Book | null> {
    return this.booksRepository.findOne({ 
      where: { username, in_progress: true } 
    });
  }

  async findOne(book_id: number): Promise<Book> {
    return this.booksRepository.findOne({ where: { book_id } });
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    const book = this.booksRepository.create(bookData);
    return this.booksRepository.save(book);
  }

  async update(book_id: number, bookData: Partial<Book>): Promise<Book> {
    await this.booksRepository.update(book_id, bookData);
    return this.findOne(book_id);
  }

  async remove(book_id: number): Promise<void> {
    await this.booksRepository.delete(book_id);
  }
}


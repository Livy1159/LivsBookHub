import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  comment_id: number;

  @Column({ name: 'book_id', type: 'int' })
  book_id: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'chapter', type: 'varchar', length: 100 })
  chapter: string;

  @Column({ name: 'comment_text', type: 'text' })
  comment_text: string;

  @Column({ name: 'commenter_name', type: 'varchar', length: 100 })
  commenter_name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}

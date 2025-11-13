import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  book_id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'author', type: 'varchar', length: 255 })
  author: string;

  @Column({ name: 'genre', type: 'varchar', length: 100, nullable: true })
  genre: string;

  @Column({ name: 'in_progress', type: 'boolean', default: false, nullable: true })
  in_progress: boolean;
}

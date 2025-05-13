import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  slug: string; // For better-descriptive URLs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  excerpt?: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'int', default: 0 })
  views: number;
}

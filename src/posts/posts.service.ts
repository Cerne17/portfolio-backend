import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Temp: Creates slug based on the title
    // TODO: Implement slugify as slug generation
    const slug =
      createPostDto.slug ||
      createPostDto.title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);

    const newPost = this.postsRepository.create({
      ...createPostDto,
      slug, // Override or use provided slug
    });
    return this.postsRepository.save(newPost);
  }

  async findAll(onlyPublished: boolean = false): Promise<Post[]> {
    if (onlyPublished) {
      return this.postsRepository.find({
        where: { isPublished: true },
        order: { createdAt: 'DESC' },
      });
    }
    return this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
  async findOneBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }
    return post;
  }
  // TODO: Implement findOneById, Update, Remove... methods
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto-update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(@Query('published') published: string) {
    const onlyPublished = published === 'true';
    return this.postsService.findAll(onlyPublished);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findOneBySlug(slug);
  }
}

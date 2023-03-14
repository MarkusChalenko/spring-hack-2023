import {
  Controller,
  Get,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import FindOneParams from 'src/internal/utils/findOneParams';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    return this.userService.getById(Number(id));
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param() { id }: FindOneParams,
    @Body() updateUser: UpdateUserDto,
  ) {
    return await this.userService.updateUser(Number(id), updateUser);
  }

  @Delete(':id')
  remove(@Param() { id }: FindOneParams) {
    return this.userService.delete(Number(id));
  }
}

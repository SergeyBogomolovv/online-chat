import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDto } from './dto/user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { HttpAuthGuard } from 'src/auth/guards/http-auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { HttpSession } from 'src/auth/decorators/http-session.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Получение информации о профиле' })
  @ApiOkResponse({ type: UserDto, description: 'Get user profile' })
  @UseGuards(HttpAuthGuard)
  @Get('me')
  getProfile(@HttpSession('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @ApiOperation({ summary: 'Обновление профиля пользователя' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('update-profile')
  @UseGuards(HttpAuthGuard)
  updateUsersProfile(
    @HttpSession('userId') userId: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, dto, avatar);
  }

  @ApiOperation({ summary: 'Поиск пользователей' })
  @ApiOkResponse({ type: [UserDto] })
  @ApiQuery({ name: 'query', type: String, required: true })
  @UseInterceptors(CacheInterceptor)
  @Get('search')
  searchUsers(@Query('query') query: string) {
    return this.usersService.searchUsers(query);
  }
}

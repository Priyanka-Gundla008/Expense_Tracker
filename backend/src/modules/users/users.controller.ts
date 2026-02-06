import {
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  Body,
  BadRequestException,
  ParseUUIDPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { User } from 'src/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { UpdateUserDto } from './DTO/update-user.dto';
import { ChangePasswordDto } from './DTO/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  // SIGNUP
  @Post('create-user')
  @ApiOperation({ summary: 'Create a new user (Signup)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / Email exists' })
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: Partial<User> }> {

    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (!createUserDto.acceptedTerms) {
      throw new BadRequestException('You must accept the Terms & Conditions');
    }

    const user = await this.userService.create(createUserDto);

    const { password, ...result } = user;

    return {
      message: 'User created successfully',
      data: result,
    };

  }

  // GET USER BY ID
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'),
    }),) id: string,
  ): Promise<{ message: string; data: Partial<User> }> {

    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;

    return {
      message: 'User fetched successfully',
      data: result,
    };
  }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update user profile' })
  // @ApiResponse({ status: 200, description: 'User updated successfully' })
  // @ApiResponse({ status: 404, description: 'User not found' })
  // async updateUser(
  //   @Param('id', new ParseUUIDPipe({ version: '4', exceptionFactory: () => new BadRequestException('Invalid UUID'), }),) id: string,
  //   @Body() updateUserDto: UpdateUserDto,): Promise<{ message: string; data: Partial<User> }> {
  //   const updatedUser = await this.userService.updateUser(id, updateUserDto);
  //   if (!updatedUser) {
  //     throw new NotFoundException('User not found');
  //   }
  //   const { password, ...result } = updatedUser;
  //   return {
  //     message: 'User updated successfully',
  //     data: result,
  //   };
  // }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        json: { type: 'string' },
      },
    },
  })
 @UseInterceptors(FileInterceptor('file'))
async updateUser(
  @Param('id') id: string,
  @Body('json') json: string,
  @UploadedFile() file?: Express.Multer.File,
): Promise<{ message: string; data: Partial<User> }> {

  let updateUserDto: UpdateUserDto;

  try {
    updateUserDto = JSON.parse(json);
  } catch {
    throw new BadRequestException('Invalid JSON format');
  }

  if (file) {
    updateUserDto.profileImage = `/uploads/${file.filename}`;
  }

  const updatedUser = await this.userService.updateUser(id, updateUserDto);

  if (!updatedUser) {
    throw new NotFoundException('User not found');
  }

  const { password, ...result } = updatedUser;

  return {
    message: 'User updated successfully',
    data: result,
  };
}



  @Post('change-password/:id/')
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id', new ParseUUIDPipe({
      version: '4',
      exceptionFactory: () => new BadRequestException('Invalid UUID'),
    }),) id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userService.changePassword(id, dto);

    return {
      message: 'Password updated successfully',
    };
  }


}

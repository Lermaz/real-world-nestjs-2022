import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { storage } from 'src/utils/file-upload.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all users' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({})
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get a user' })
  @ApiParam({ name: 'id', description: 'user id' })
  @ApiBearerAuth('access-token')
  @ApiOkResponse({})
  async getOneUser(@Param('id') id: string) {
    return await this.userService.getOneUser(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrator')
  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({})
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'id', description: 'user id' })
  @ApiOkResponse({})
  async updateUsuarioWithAllParams(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrator')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'id',
    description: 'id of the user to be deleted.',
  })
  @ApiOkResponse({})
  async deleteOneEscuela(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  @Roles('Administrador')
  @ApiOperation({ summary: 'Upload files' })
  @ApiBearerAuth('access-token')
  @ApiCreatedResponse({})
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file_image', storage('./public/temp')))
  async createEscuela(
    @UploadedFile() file,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    uploadFileDto.file_image = file.filename;
    return await this.userService.uploadFile(uploadFileDto);
  }
}

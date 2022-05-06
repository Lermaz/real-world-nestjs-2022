import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { errorMessage } from 'src/utils/error-message';
import { IUser } from './interface/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UploadService } from 'src/upload/upload.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    private readonly mailService: MailService,
    private readonly uploadService: UploadService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const user = new this.userModel(createUserDto);
      await this.isEmailUnique(user.email);

      await user.save();
      await this.mailService.sendNotification('example.html', user.email, {
        name: `${user.first_name} ${user.last_name}`,
      });

      return user;
    } catch (err) {
      errorMessage(err, 'Error creating user.');
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      return await this.userModel.find({
        dt_eliminado: null,
      });
    } catch (err) {
      errorMessage(err, 'Error getting all users.');
    }
  }

  async getOneUser(id: string): Promise<IUser> {
    try {
      return await this.userModel.findById(id);
    } catch (err) {
      errorMessage(err, 'User not found.');
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    try {
      const user = await this.userModel.findById({ _id: id });

      if (updateUserDto.email != user.email) {
        await this.isEmailUnique(updateUserDto.email);
      }

      if (bcrypt.compare(user.password, updateUserDto.password)) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      await user.updateOne(updateUserDto);
      return user;
    } catch (err) {
      errorMessage(err, 'Failed to update user.');
    }
  }

  async deleteUser(id: string): Promise<IUser> {
    try {
      return await this.userModel.findByIdAndUpdate(id, {
        dt_eliminado: Date(),
      });
    } catch (err) {
      errorMessage(err, 'Error deleting user.');
    }
  }

  async uploadFile(uploadFileDto: UploadFileDto) {
    try {
      return this.uploadService.uploadFile(uploadFileDto.file_image, '/files/');
    } catch (err) {
      errorMessage(err, 'Error al crear la escuela.');
    }
  }

  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({
      email: email,
      dt_eliminado: null,
    });

    if (user) {
      throw new BadRequestException('There is already a user with this email.');
    }
  }
}

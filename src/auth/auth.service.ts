import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { RefreshToken } from './interfaces/refresh-token.interface';
import { v4 } from 'uuid';
import { IUser } from 'src/models/users/interface/user.interface';
import * as Cryptr from 'cryptr';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  cryptr: any;

  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {
    this.cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
  }

  async login(req: Request, loginUserDto: LoginUserDto) {
    loginUserDto.email = loginUserDto.email.trim();

    const user = await this.findUserByEmail(loginUserDto.email);
    await this.checkPassword(loginUserDto.password, user);

    return {
      accessToken: await this.createAccessToken(user._id),
      refreshToken: await this.createRefreshToken(req, user._id),
    };
  }

  async createAccessToken(userId: string) {
    const accessToken = sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return this.encryptText(accessToken);
  }

  async createRefreshToken(req: Request, userId) {
    const refreshToken = new this.refreshTokenModel({
      userId,
      refreshToken: v4(),
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  async findRefreshToken(token: string) {
    const refreshToken = await this.refreshTokenModel.findOne({
      refreshToken: token,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('The user has been disconnected.');
    }
    return refreshToken.userId;
  }

  async validateUser(jwtPayload: JwtPayload): Promise<any> {
    const user = await this.userModel.findOne({
      _id: jwtPayload.userId,
      verified: true,
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }

  private jwtExtractor(request) {
    let token = null;
    if (request.header('x-token')) {
      token = request.get('x-token');
    } else if (request.headers.authorization) {
      token = request.headers.authorization
        .replace('Bearer ', '')
        .replace(' ', '');
    } else if (request.body.token) {
      token = request.body.token.replace(' ', '');
    }
    if (request.query.token) {
      token = request.body.token.replace(' ', '');
    }
    const cryptr = new Cryptr(process.env.ENCRYPT_JWT_SECRET);
    if (token) {
      try {
        token = cryptr.decrypt(token);
      } catch (err) {
        throw new UnauthorizedException(
          'You currently do not have the necessary security permissions.',
        );
      }
    }
    return token;
  }

  returnJwtExtractor() {
    return this.jwtExtractor;
  }

  getBrowserInfo(req: Request): string {
    return req.header['user-agent'] || 'XX';
  }

  encryptText(text: string): string {
    return this.cryptr.encrypt(text);
  }

  private async findUserByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({
      email: email,
      dt_eliminado: null,
    });
    if (!user) {
      throw new NotFoundException('The email or password is incorrect.');
    }
    return user;
  }

  private async checkPassword(attemptPass: string, user) {
    const match = await bcrypt.compare(attemptPass, user.password);
    if (!match) {
      throw new NotFoundException('Wrong email or password.');
    }
    return match;
  }
}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../entities/user.entity';

interface AuthDto {
  username: string;
  password: string;
}

export class AuthResponse {
  accessToken: string;
  user: { id: string; username: string };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: AuthDto): Promise<AuthResponse> {
    const existingUser = await this.userModel.findOne({
      username: registerDto.username.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = new this.userModel({
      username: registerDto.username.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    return this.generateTokenResponse(user);
  }

  async login(loginDto: AuthDto): Promise<AuthResponse> {
    const user = await this.userModel.findOne({
      username: loginDto.username.toLowerCase(),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: UserDocument): AuthResponse {
    const userObj = user.toObject();
    const userId = userObj._id ? userObj._id.toString() : user.id;
    const payload = { sub: userId, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: userId, username: user.username },
    };
  }
}
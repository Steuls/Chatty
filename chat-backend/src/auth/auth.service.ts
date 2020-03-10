import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../db/repositories/user.repository";
import { User } from "../db/entities/User.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt/jwt.payload";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
              private readonly jwtService: JwtService) {
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userRepository.findOne({ where: { userName: username }});
    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user; // split password and remaining variables in user
      return result;
    }
    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    const exists: User[] = await this.userRepository.find({ userName: createUserDto.userName });

    if (exists.length !== 0) { throw new BadRequestException(); }

    return this.userRepository.createUser(createUserDto);
  }

  async login(user: any): Promise<any> {
    const payload: JwtPayload = new JwtPayload(user.userName, user.userId);
    return {
      accessToken: this.jwtService.sign(payload.return()),
      userName: user.userName,
      userId: user.userId,
      expiresAt: new Date(new Date().getTime() + (5 * 60000)) // 5 Minutes from now
    };
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user: User = await this.userRepository.findOne(id);
    user.password = bcrypt.hashSync(newPassword);
    await user.save();
  }

  checkAuth(token: string): any {
    return this.jwtService.verify(token);
  }
}


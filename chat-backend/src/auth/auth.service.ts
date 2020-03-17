import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "../db/repositories/user.repository";
import { User } from "../db/entities/User.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt/jwt.payload";
import { UserTokenRepository } from "../db/repositories/userToken.repository";
import { UserToken } from "../db/entities/UserToken.entity";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository,
              @InjectRepository(UserTokenRepository) private userTokenRepository: UserTokenRepository,
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
    const token: string = await this.tokenUpdate(user);
    return {
      accessToken: token,
      userName: user.userName,
      userId: user.userId,
      expiresAt: new Date(new Date().getTime() + (10 * 60000)) // 10 Minutes from now
    };
  }

  async permLogin(user: any): Promise<any> {
    const token: string = await this.tokenUpdate(user);
    const temp: Date = new Date();
    const expiry: Date = new Date();
    expiry.setDate(temp.getDate() + 7); // 7 days from now
    return {
      accessToken: token,
      userName: user.userName ? user.userName : user.username,
      userId: user.userId,
      expiresAt: expiry
    };
  }

  async tokenUpdate(user: any): Promise<string> {
    const payload: JwtPayload = new JwtPayload(user.userName ? user.userName : user.username, user.userId);
    const token: string = this.jwtService.sign(payload.return());
    let userToken: UserToken | null = await this.userTokenRepository.findOne({userId: user.userId});
    if (userToken) {
      userToken.token = token;
    } else {
      userToken = new UserToken();
      userToken.token = token;
      userToken.userId = user.userId;
    }
    await userToken.save();
    return token;
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user: User = await this.userRepository.findOne(id);
    user.password = bcrypt.hashSync(newPassword);
    await user.save();
  }

  checkAuth(token: string): any {
    return this.jwtService.verify(token);
  }

  async checkJwtDbAuth(token: string): Promise<UserToken | null> {
    return await this.userTokenRepository.findOne({token: token});
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}


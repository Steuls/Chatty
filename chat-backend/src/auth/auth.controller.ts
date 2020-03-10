import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  ValidationPipe, Get, Put,
} from "@nestjs/common";
import { LocalAuthGuard } from "./local/local-auth.guard";
import { CreateUserDto } from "../dto/create-user.dto";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post("signup")
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<boolean> {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("refresh")
  async refresh(@Request() req: any): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Put("changePassword")
  async changePassword(@Request() req: any, @Body("newPassword") newPassword: string): Promise<void> {
    await this.authService.changePassword(req.userId, newPassword);
  }
}

import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../db/repositories/user.repository";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local/local.strategy";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../constants/constants";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { JwtWsStrategy } from "./ws/jwtWs.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "10m" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtWsStrategy],
  exports: [AuthService]
})
export class AuthModule {}

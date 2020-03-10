import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { jwtConstants, jwtExtraction } from "../../constants/constants";

@Injectable()
export class JwtWsStrategy extends PassportStrategy(Strategy, "websocket") {
  constructor() {
    super({
      jwtFromRequest: jwtExtraction,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any): Promise<any> {
    return { userId: payload.sub, username: payload.username };
  }
}

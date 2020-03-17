import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { UserToken } from "../../db/entities/UserToken.entity";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!context.switchToWs().getData().token) {
      return false;
    }
    const token: string = context.switchToWs().getData().token;
    const check: any = this.authService.checkAuth(token);
    const secondCheck: UserToken | null = await this.authService.checkJwtDbAuth(token);
    if (!!check && !!secondCheck) {
      const decoded: any = this.authService.decodeToken(token);
      if (decoded.sub === secondCheck.userId) {
        return true;
      }
    }
    return false;
  }
}

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    if (!context.switchToWs().getData().token) { return false; }
    const check: any = this.authService.checkAuth(context.switchToWs().getData().token);
    return !!check;

  }
}

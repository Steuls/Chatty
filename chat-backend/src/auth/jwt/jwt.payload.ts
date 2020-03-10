export class JwtPayload {
  sub: string; // sub for ID is consistent with jwt standards
  username: string;

  constructor( username: string, userId: string ) {
    this.username = username;
    this.sub = userId;
  }

  convert(): any {
    return { userId: this.sub, username: this.username };
  }

  return(): any {
    return { username: this.username, sub: this.sub };
  }
}

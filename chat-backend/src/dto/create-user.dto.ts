import { IsString, MaxLength, MinLength, Matches } from "class-validator";


export class CreateUserDto {
  @IsString()
  @MinLength(4)
  userName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password must include and uppercase, lowercase and number"
  })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

}

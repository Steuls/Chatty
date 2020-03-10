import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User.entity";
import { CreateUserDto } from "../../dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const { userName, password, firstName, lastName } = createUserDto;

    const hash: string = bcrypt.hashSync(password);

    const user: User = this.create({
      userName,
      password: hash,
      firstName,
      lastName
    });

    await user.save();
    return true;

  }
}

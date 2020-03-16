import { EntityRepository, Repository } from "typeorm";
import { UserToken } from "../entities/UserToken.entity";

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {

}

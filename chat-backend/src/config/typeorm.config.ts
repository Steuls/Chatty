import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Group } from "../db/entities/Group.entity";
import { Message } from "../db/entities/Message.entity";
import { User } from "../db/entities/User.entity";
import { UserToken } from "../db/entities/UserToken.entity";
import { FileStore } from "../db/entities/FileStore.entity";

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mssql",
  host: "localhost\\sqlexpress",
  port: 1433,
  username: "NestJS",
  password: "Passw0rd!",
  database: "Chat",
  entities: [Group, Message, User, UserToken, FileStore]
};

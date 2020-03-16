import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Group } from "./Group.entity";
import { Message } from "./Message.entity";
import { UserToken } from "./UserToken.entity";

@Index("PK_User", ["userId"], { unique: true })
@Entity("User", { schema: "dbo" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "UserID" })
  userId: number;

  @Column("nvarchar", { name: "FirstName" })
  firstName: string;

  @Column("nvarchar", { name: "LastName" })
  lastName: string;

  @Column("nvarchar", { name: "UserName" })
  userName: string;

  @Column("nvarchar", { name: "Password" })
  password: string;

  @ManyToMany(
    () => Group,
    group => group.users
  )
  groups: Group[];

  @OneToMany(
    () => Message,
    message => message.fkSender
  )
  sentMessages: Message[];

  @OneToOne(
    () => UserToken,
    userToken => userToken.user
  )
  userToken: UserToken;
}

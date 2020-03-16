import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User.entity";
import { Message } from "./Message.entity";

@Index("PK_Group", ["groupId"], { unique: true })
@Entity("Group", { schema: "dbo" })
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "GroupID" })
  groupId: number;

  @Column("nvarchar", { name: "GroupName" })
  groupName: string;

  @Column("nvarchar", { name: "GroupDescription", nullable: true })
  groupDescription: string | null;

  @ManyToMany(
    () => User,
    user => user.groups
  )
  @JoinTable({
    name: "GroupUserMap",
    joinColumns: [{ name: "FKGroupID", referencedColumnName: "groupId" }],
    inverseJoinColumns: [{ name: "FKUserID", referencedColumnName: "userId" }],
    schema: "dbo"
  })
  users: User[];

  @OneToMany(
    () => Message,
    message => message.fkGroup
  )
  messages: Message[];
}

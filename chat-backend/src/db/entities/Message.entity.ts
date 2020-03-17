import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";
import { Group } from "./Group.entity";
import { FileStore } from "./FileStore.entity";

@Index("PK_Message", ["messageId"], { unique: true })
@Entity("Message", { schema: "dbo" })
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "MessageID" })
  messageId: number;

  @Column("nvarchar", { name: "Message" })
  message: string;

  @Column("datetime", { name: "TimeSent" })
  timeSent: Date;

  @Column("bit", { name: "isFile", default: 0 })
  isFile: boolean;

  @ManyToOne(
    () => FileStore,
    fileStore => fileStore.messages
  )
  @JoinColumn([{ name: "FKFileID", referencedColumnName: "streamId" }])
  fkFile: FileStore;

  @ManyToOne(
    () => Group,
    group => group.messages
  )
  @JoinColumn([{ name: "FKGroupID", referencedColumnName: "groupId" }])
  fkGroup: Group;

  @ManyToOne(
    () => User,
    user => user.sentMessages
  )
  @JoinColumn([{ name: "FKSenderID", referencedColumnName: "userId" }])
  fkSender: User;
}

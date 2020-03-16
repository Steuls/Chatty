import { BaseEntity, Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "./User.entity";

@Index("PK_UserToken", ["userId"], { unique: true })
@Entity("UserToken", { schema: "dbo" })
export class UserToken extends BaseEntity {
  @Column("nvarchar", { name: "Token", nullable: false })
  token: string;

  @PrimaryColumn("int", { name: "UserID", nullable: false })
  userId: number;

  @OneToOne(
    () => User,
    user => user.userToken
  )
  @JoinColumn([{ name: "UserID", referencedColumnName: "userId" }])
  user: User;
}

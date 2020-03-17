import { EntityRepository, Repository } from "typeorm";
import { Message } from "../entities/Message.entity";


@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {

  async getAllMessages(numberLoaded: number, groupIds: number[]): Promise<Message[]> {
    return this.createQueryBuilder("message")
      .where("message.FKGroupID IN (:...groups)", {
        groups: groupIds
      })
      .orderBy("message.TimeSent")
      .skip(numberLoaded)
      // take should be used here instead but due to a bug take + orderby + left join breaks TypeOrm should be a fix coming
      .limit(100) // https://github.com/typeorm/typeorm/issues/747 + https://github.com/typeorm/typeorm/issues/4270
      .leftJoinAndSelect("message.fkSender", "sender") // https://typeorm.io/#/many-to-many-relations/loading-many-to-many-relations
      .leftJoinAndSelect("message.fkFile", "file") // https://typeorm.io/#/many-to-many-relations/loading-many-to-many-relations
      .getMany();
      // .relation("fkSender") // https://typeorm.io/#/relational-query-builder
      // .loadMany();
  }

  async getRoomMessages(numberLoaded: number, groupId: number): Promise<Message[]> {
    return this.createQueryBuilder("message")
      .where("message.FKGroupID = :id", {
        id: groupId
      })
      // .orderBy("message.TimeSent")
      .skip(numberLoaded)
      .limit(100)
      .leftJoinAndSelect("message.fkSender", "sender")
      .getMany();
  }
}

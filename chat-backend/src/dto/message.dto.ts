import { Message } from "../db/entities/Message.entity";

export class MessageDto {
  _id: number;
  content: string;
  sender_id: string;
  username: string;
  date: string;
  timestamp: string;

  constructor(message: Message) {
    this._id = message.messageId;
    this.content = message.message;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.sender_id = message.fkSender.userId.toString();
    this.username = message.fkSender.userName;
    this.date = message.timeSent.toDateString();
    this.timestamp = message.timeSent.toTimeString();
  }


}

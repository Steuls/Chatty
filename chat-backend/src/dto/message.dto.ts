import { Message } from "../db/entities/Message.entity";
import { fileStoreUrl } from "../constants/constants";

export class MessageDto {
  _id: number;
  content: string;
  sender_id: string;
  username: string;
  date: string;
  timestamp: string;
  file: {
    name: string;
    size: number;
    type: string;
    url: string
  } | null;

  constructor(message: Message) {
    this._id = message.messageId;
    this.content = message.message;
    // eslint-disable-next-line @typescript-eslint/camelcase
    this.sender_id = message.fkSender.userId.toString();
    this.username = message.fkSender.userName;
    this.date = message.timeSent.toDateString();
    this.timestamp = message.timeSent.toTimeString();
    if (!message.isFile) {
      this.file = null;
    } else {
      this.file = {
        name: message.fkFile.name,
        size: message.fkFile.cachedFileSize ? parseInt(message.fkFile.cachedFileSize) : 0,
        type: message.fkFile.fileType,
        url: fileStoreUrl + message.fkFile.name
      };
    }
  }


}

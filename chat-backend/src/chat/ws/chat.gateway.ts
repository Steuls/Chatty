import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseFilters, UseGuards } from "@nestjs/common";
import { WsAuthGuard } from "../../auth/ws/ws-auth.guard";
import { ChatService } from "../api/chat.service";
import { MessageDto } from "../../dto/message.dto";
import { User } from "../../db/entities/User.entity";

@UseGuards(WsAuthGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway(81)
export class ChatGateway implements OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  groups: number[];

  constructor(private chatService: ChatService) {
    this.chatService.getAllGroupIds().then(ids => this.groups = ids);
  }

  @SubscribeMessage("test")
  async test(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(data.message);
    client.emit("testReceived", {message: data.message});
    console.log("test sent");
  }

  @SubscribeMessage("login")
  async onLogin(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    const user: User = await this.chatService.getUser(data.id);
    const ids: number[] = this.chatService.getGroupIds(user);
    ids.forEach((id) => {
      client.join(id.toString());
    });
  }

  @SubscribeMessage("sendMessage")
  async onNewMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    const {roomId, content, userId} = data;
    if (!await this.chatService.inGroup(userId, roomId)) { throw  new WsException("User not in group"); }
    const message: MessageDto = await this.chatService.newMessage(userId, roomId, content);
    this.server.in(`${roomId}`).emit("newMessage", {roomId: roomId, message: message});
  }

  async handleDisconnect(client: Socket): Promise<any> {
    // rooms left automatically on disconnection
  }
}

import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UseFilters, UseGuards } from "@nestjs/common";
import { WsAuthGuard } from "../../auth/ws/ws-auth.guard";
import { ChatService } from "../api/chat.service";
import { MessageDto } from "../../dto/message.dto";
import { User } from "../../db/entities/User.entity";
import { GroupDto } from "../../dto/group.dto";
import { UserStorage } from "./userStorage.model";

@UseGuards(WsAuthGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway(81)
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: UserStorage[] = [];

  constructor(private chatService: ChatService) {}

  @SubscribeMessage("test")
  async test(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log(data.message);
    client.emit("testReceived", { message: data.message });
    console.log("test sent");
  }

  @SubscribeMessage("login")
  async onLogin(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const user: User = await this.chatService.getUser(data.id);
    const check: number[] = this.users.map(user => user.userId);
    if (this.users.length === 0 || !check.includes(data.id)) {
      this.users.push(new UserStorage(user, client.id));
    }
    const ids: number[] = this.chatService.getGroupIds(user);
    ids.forEach(id => {
      client.join(id.toString());
    });
  }

  @SubscribeMessage("sendMessage")
  async onNewMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { roomId, content, userId } = data;
    if (!(await this.chatService.inGroup(userId, roomId))) {
      throw new WsException("User not in group");
    }
    const message: MessageDto = await this.chatService.newMessage(
      userId,
      roomId,
      content,
    );
    this.server
      .in(`${roomId}`)
      .emit("newMessage", { roomId: roomId, message: message });
  }

  // @SubscribeMessage("sendFile")
  // async onNewFile(
  //   @MessageBody() data: any,
  //   @ConnectedSocket() client: Socket,
  // ): Promise<void> {
  //   const { roomId, file, userId } = data;
  //   if (!(await this.chatService.inGroup(userId, roomId))) {
  //     throw new WsException("User not in group");
  //   }
  //   const message: MessageDto = await this.chatService.newMessage(
  //     userId,
  //     roomId,
  //     content,
  //   );
  //   this.server
  //     .in(`${roomId}`)
  //     .emit("newMessage", { roomId: roomId, message: message });
  // }

  @SubscribeMessage("roomAdded")
  async onNewRoom(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const group: GroupDto = await this.chatService.createGroup(
      data.group.groupName,
      data.group.groupDescription,
      data.group.users,
      data.message,
      data.senderId,
    );
    const ids: number[] = group.users.map(user => user._id);
    this.users.forEach(user => {
      if (ids.includes(user.userId)) {
        this.server.to(`${user.socketId}`).emit("newRoom", { group: group });
      }
    });
  }

  @SubscribeMessage("changeGroupName")
  async changeName(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    await this.chatService.changeGroupName(data.groupId, data.groupName);
    this.server.in(`${data.groupId}`).emit("ChangedGroupName", { groupName: data.groupName, groupId: data.groupId });
  }

  @SubscribeMessage("deleteGroup")
  async deleteGroup(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    await this.chatService.deleteGroup(data.groupId);
    this.server.in(`${data.groupId}`).emit("forceLeave", {roomId: data.groupId});
  }

  @SubscribeMessage("leaveGroup")
  async leaveGroup(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
    client.leave(`${data.groupId}`);
    if (await this.chatService.groupExists(data.groupId)) {
      const user: number = this.users.filter(user => user.socketId === client.id).pop().userId;
      await this.chatService.leaveGroup(data.groupId, user);
    }
  }

  async handleDisconnect(client: Socket): Promise<any> {
    const index: number = this.users.findIndex(user => {
      return user.socketId === client.id;
    });
    this.users.splice(index, 1);
  }
}

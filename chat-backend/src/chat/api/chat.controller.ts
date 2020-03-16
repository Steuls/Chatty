import {
  Controller,
  Get,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  Post,
  Body,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../../auth/jwt/jwt-auth.guard";
import { MessageDto } from "../../dto/message.dto";
import { GroupDto } from "../../dto/group.dto";
import { UserDto } from "../../dto/user.dto";
import { User } from "../../db/entities/User.entity";

@UseGuards(JwtAuthGuard)
@Controller("chatApi")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get("room")
  getRoomMessages(
    @Request() req: any,
    @Query("numberLoaded", ParseIntPipe) numberLoaded: number,
    @Query("roomId", ParseIntPipe) roomId: number,
  ): Promise<MessageDto[]> {
    return this.chatService.getRoomMessages(
      req.user.userId,
      numberLoaded,
      roomId,
    );
  }

  @Get("all")
  getAllMessages(
    @Request() req: any,
    @Query("numberLoaded", ParseIntPipe) numberLoaded: number,
  ): Promise<MessageDto[]> {
    return this.chatService.getAllMessages(req.user.userId, numberLoaded);
  }

  @Get("groups")
  getGroupInfo(@Request() req: any): Promise<GroupDto[]> {
    return this.chatService.getGroupInfo(req.user.userId);
  }

  @Get("users")
  async getUserList(): Promise<UserDto[]> {
    const users: User[] = await this.chatService.getUsers();
    return users.map(user => {
      return new UserDto(user);
    });
  }
}

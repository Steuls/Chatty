import {
  Controller,
  Get,
  UseGuards,
  Request,
  ParseIntPipe,
  Query, Post, Body,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../../auth/jwt/jwt-auth.guard";
import { MessageDto } from "../../dto/message.dto";
import { GroupDto } from "../../dto/group.dto";

@Controller("chatApi")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get("room")
  getRoomMessages(
    @Request() req: any,
    @Query("numberLoaded", ParseIntPipe) numberLoaded: number,
    @Query("roomId", ParseIntPipe) roomId: number,
  ): Promise<MessageDto[]> {
    // console.log(`fetch fired for ${roomId}`);
    return this.chatService.getRoomMessages(
      req.user.userId,
      numberLoaded,
      roomId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("all")
  getAllMessages(
    @Request() req: any,
    @Query("numberLoaded", ParseIntPipe) numberLoaded: number,
  ): Promise<MessageDto[]> {
    return this.chatService.getAllMessages(req.user.userId, numberLoaded);
  }

  @UseGuards(JwtAuthGuard)
  @Get("groups")
  getGroupInfo(@Request() req: any): Promise<GroupDto[]> {
    return this.chatService.getGroupInfo(req.user.userId);
  }
}

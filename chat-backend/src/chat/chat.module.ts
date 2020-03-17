import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../db/repositories/user.repository";
import { GroupRepository } from "../db/repositories/group.repository";
import { MessageRepository } from "../db/repositories/message.repository";
import { ChatController } from "./api/chat.controller";
import { ChatService } from "./api/chat.service";
import { ChatGateway } from "./ws/chat.gateway";
import { AuthModule } from "../auth/auth.module";
import { FileStoreRepository } from "../db/repositories/fileStore.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, GroupRepository, MessageRepository, FileStoreRepository]), AuthModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}

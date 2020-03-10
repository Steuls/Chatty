import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "./config/typeorm.config";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";
import { SentimentModule } from "./sentiment/sentiment.module";

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ChatModule, AuthModule, SentimentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

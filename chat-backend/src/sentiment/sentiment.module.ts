import { Module } from "@nestjs/common";
import { SentimentController } from "./sentiment.controller";

@Module({
  controllers: [SentimentController]
})
export class SentimentModule {}

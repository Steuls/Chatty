import { SpMessageLatestListGetProcedure } from "../db/Stored Procedures/spMessageLatestListGet.procedure";
import { Group } from "../db/entities/Group.entity";
import { InternalServerErrorException } from "@nestjs/common";

export class GroupDto {
  roomId: number;
  roomName: string;
  lastMessage: {
    content: string;
    sender_id: number;
    username: string;
    timestamp: string;
  };
  users:
    {
      _id: number;
      username: string;
    }[]
  ;

  constructor(groupWithMessages: SpMessageLatestListGetProcedure, groupsWithUsers: Group[]) {
    const check: Group[] = groupsWithUsers.filter(group => group.groupId === groupWithMessages.GroupID);
    if (check.length > 1) { throw new InternalServerErrorException("More than one group with the same ID"); }
    if (check.length === 0) { throw new InternalServerErrorException("No group with that ID"); }
    const group: Group = check.pop();

    this.roomId = groupWithMessages.GroupID;
    this.roomName = groupWithMessages.GroupName;
    this.lastMessage = {
      content: groupWithMessages.Message,
      // eslint-disable-next-line @typescript-eslint/camelcase
      sender_id: groupWithMessages.SenderID,
      username: groupWithMessages.Sender,
      timestamp: groupWithMessages.TimeSent.toTimeString(),
    };
    this.users = group.users.map(user => {
      return {
        _id: user.userId,
        username: user.userName
      };
    });
  }
}

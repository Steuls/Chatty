import { EntityRepository, Repository } from "typeorm";
import { Group } from "../entities/Group.entity";
import { SpMessageLatestListGetProcedure } from "../Stored Procedures/spMessageLatestListGet.procedure";
import { GroupDto } from "../../dto/group.dto";
import {InternalServerErrorException, NotFoundException} from "@nestjs/common";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {

  async getGroups(userId: number, groupIds: number[]): Promise<GroupDto[]> {
    const groupsWithMessages: SpMessageLatestListGetProcedure[] = await this.query(`spMessageLatestListGet @UserID='${userId}'`);
    const groupsWithUsers: Group[] = await this.findByIds(groupIds, { relations: ["users"]});
    return groupsWithMessages.map(group => {
      return new GroupDto(group, groupsWithUsers);
    });
  }

  async getGroup(groupId: number): Promise<GroupDto> {
    const groupWithMessage: SpMessageLatestListGetProcedure[] = await this.query(`spMessageLatestListGet @GroupID='${groupId}'`);
    if (groupWithMessage.length > 1) { throw new InternalServerErrorException("More than one group with the same ID"); }
    if (groupWithMessage.length === 0) { throw new InternalServerErrorException("No group with that ID"); }
    const group: SpMessageLatestListGetProcedure = groupWithMessage.pop();
    const groupWithUsers: Group = await this.findOne(groupId, {relations: ["users"]});
    const groupArr: Group[] = [groupWithUsers];
    return new GroupDto(group, groupArr);
  }

  async inGroup(userId: number, groupId: number): Promise<boolean> {
    const group: Group = await this.findOne(groupId, {relations: ["users"]});
    if (group === null) { throw new NotFoundException("Group Not found"); }
    const ids: number[] = group.users.map(user => user.userId);
    return ids.includes(userId);
  }
}

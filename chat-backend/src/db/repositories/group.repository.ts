import { EntityRepository, Repository } from "typeorm";
import { Group } from "../entities/Group.entity";
import { SpMessageLatestListGetProcedure } from "../Stored Procedures/spMessageLatestListGet.procedure";
import { GroupDto } from "../../dto/group.dto";
import { NotFoundException } from "@nestjs/common";

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {

  async getGroups(userId: number, groupIds: number[]): Promise<GroupDto[]> {
    const groupsWithMessages: SpMessageLatestListGetProcedure[] = await this.query(`spMessageLatestListGet @UserID='${userId}'`);
    const groupsWithUsers: Group[] = await this.findByIds(groupIds, { relations: ["users"]});
    return groupsWithMessages.map(group => {
      return new GroupDto(group, groupsWithUsers);
    });
  }

  async inGroup(userId: number, groupId: number): Promise<boolean> {
    const group: Group = await this.findOne(groupId, {relations: ["users"]});
    if (group === null) { throw new NotFoundException("Group Not found"); }
    const ids: number[] = group.users.map(user => user.userId);
    return ids.includes(userId);
  }
}

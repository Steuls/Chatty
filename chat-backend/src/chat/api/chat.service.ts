import {Injectable, NotFoundException, UnauthorizedException,} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRepository} from "../../db/repositories/user.repository";
import {GroupRepository} from "../../db/repositories/group.repository";
import {MessageRepository} from "../../db/repositories/message.repository";
import {User} from "../../db/entities/User.entity";
import {MessageDto} from "../../dto/message.dto";
import {Message} from "../../db/entities/Message.entity";
import {GroupDto} from "../../dto/group.dto";
import {Group} from "../../db/entities/Group.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
  ) {}

  async getAllMessages(
    userId: number,
    numberLoaded: number,
  ): Promise<MessageDto[]> {
    const groupIds: number[] = this.getGroupIds(await this.getUser(userId));
    const messages: Message[] = await this.messageRepository.getAllMessages(
      numberLoaded,
      groupIds,
    );
    if (messages === null) {
      throw new NotFoundException("No Messages were found");
    }
    return messages.map(message => {
      return new MessageDto(message);
    });
  }

  async getRoomMessages(
    userId: number,
    numberLoaded: number,
    roomId: number,
  ): Promise<MessageDto[]> {
    if (!(await this.groupRepository.inGroup(userId, roomId))) {
      throw new UnauthorizedException("User not in group");
    }
    const messages: Message[] = await this.messageRepository.getRoomMessages(
      numberLoaded,
      roomId,
    );
    if (messages === null || messages.length === 0) {
      throw new NotFoundException("No Messages were found");
    }
    return messages.map(message => {
      return new MessageDto(message);
    });
  }

  async getGroupInfo(userId: number): Promise<GroupDto[]> {
    const groupIds: number[] = this.getGroupIds(await this.getUser(userId));
    return this.groupRepository.getGroups(userId, groupIds);
  }

  async getUser(userId: number): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { userId: userId },
      relations: ["groups"],
    });
    if (user === null) {
      throw new NotFoundException("User was not found");
    }
    return user;
  }

  getGroupIds(user: User): number[] {
    let groupIds: number[];
    if (user.groups !== null) {
      groupIds = user.groups.map(group => group.groupId);
    } else {
      groupIds = [-1];
    }
    return groupIds;
  }

  async getAllGroupIds(): Promise<number[]> {
    const groups: Group[] = await this.groupRepository
      .createQueryBuilder()
      .getMany();
    const ids: number[] = groups.map(group => group.groupId);
    return ids;
  }

  async inGroup(userId: number, groupId: number): Promise<boolean> {
    return this.groupRepository.inGroup(userId, groupId);
  }

  async newMessage(
    senderId: number,
    roomId: number,
    content: string,
  ): Promise<any> {
    const message: Message = new Message();
    message.fkSender = await this.userRepository.findOne(senderId);
    message.fkGroup = await this.groupRepository.findOne(roomId);
    message.message = content;
    message.timeSent = new Date();
    await message.save();
    return new MessageDto(message);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async createGroup(
    groupName: string,
    groupDescription: string,
    users: number[],
    content: string,
    senderId: number,
  ): Promise<GroupDto> {
    const userArr: User[] = [];

    for (const user of users) {
      userArr.push(await this.userRepository.findOne(user));
    }

    const group: Group = new Group();
    group.groupName = groupName;
    group.groupDescription = groupDescription;
    group.users = userArr;
    await group.save();

    const message: Message = new Message();
    message.message = content;
    message.fkSender = await this.userRepository.findOne(senderId);
    message.fkGroup = group;
    message.timeSent = new Date();
    await message.save();

    return await this.groupRepository.getGroup(group.groupId);
  }

  async changeGroupName(groupId: number, groupName: string): Promise<void> {
    if (!await this.groupExists(groupId)) { throw new NotFoundException("Group does not exist"); }
    const group: Group = await this.groupRepository.findOne(groupId);
    group.groupName = groupName;
    await group.save();
  }

  async deleteGroup(groupId: number): Promise<void> {
    await this.groupRepository.query(`spDeleteGroup @GroupID=${groupId}`);
  }

  async groupExists(groupId: number): Promise<boolean> {
    const check: any = await this.groupRepository.findOne(groupId);
    return !!check; // check is either an object or undefined this converts to bool
  }

  async leaveGroup(groupId: number, userId: number): Promise<void> {
    const group: Group = await this.groupRepository.findOne(groupId);
    const index: number = group.users.findIndex(user => {
      return user.userId === userId;
    });
    group.users.splice(index, 1);
    await group.save();
  }
}

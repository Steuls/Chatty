import {User} from "../../db/entities/User.entity";

export class UserStorage {
    userId: number;
    socketId: string;

    constructor(user: User, socketId: string) {
        this.userId = user.userId;
        this.socketId = socketId;
    }
}

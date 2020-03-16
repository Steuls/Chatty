import {User} from "../db/entities/User.entity";

export class UserDto {
    text: string;
    value: number;

    constructor(user: User) {
        this.text = user.userName;
        this.value = user.userId;
    }
}

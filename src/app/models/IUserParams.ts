import { IUserResponse } from "../interfaces/IUserResponse";

export class UserParams {
    gender: string;
    minAge= 18;
    maxAge= 99;
    pageNumber = 1;
    pageSize = 2;
    orderBy = "lastActive"


    constructor(user: IUserResponse) {
        this.gender = user.gender === "female"? "male":"female";
    }
}
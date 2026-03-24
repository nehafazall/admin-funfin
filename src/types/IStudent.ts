import { ICourse } from "./ICourse";
import { IUser } from "./IUser";

export interface IStudent {
    _id: string;
    name: string;
    email: string;
    code: string;
    attendance:{
        date:Date;
        courseId:ICourse;
        section:{
            language:string;
            time:string;
        }
    }[];
    adminId: IUser;
    createdAt: string;
    updatedAt: string;
    buyedCourse: ICourse;
}



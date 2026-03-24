import { ICourse } from "./ICourse";
import { IStudent } from "./IStudent";

export interface IBooking  {
    _id:string;
    courseId:ICourse;
    studentId:IStudent;
    studentCode:string;
    section:{
        language:string;
        time:string
    }
    bookingDate:string;
    
    isCancelled:boolean;
    createdAt:Date;
    updatedAt:Date;
}   



// [
//     {
//       "_id": "6878dd86fc1b9a62e9067e76",
//       "name": "abshar",
//       "code": "L411023",
//       "isActive": true,
//       "limit": 10,
//       "email": "absharameen615@gmail.com",
//       "isDeleted": false
//     },
//     {
//       "_id": "6878dd86fc1b9a62e9067e76",
//       "name": "abshar",
//       "code": "L411023",
//       "isActive": true,
//       "limit": 10,
//       "email": "absharameen615@gmail.com",
//       "isDeleted": false
//     }
//   ]

export interface IBookingGroupedByDateTime {
    [key: string]: {
        _id:string;
        name:string;
        code:string;
        isActive:boolean;
        limit:number;
        email:string;
        isDeleted:boolean;
        courseName:string;
        time:string;
    }[];
}
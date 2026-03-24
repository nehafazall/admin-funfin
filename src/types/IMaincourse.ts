export interface IMainCourse {
    _id:string;
    name:string;
    description:string;
    image:string;
    courseCount?:number;
    isDeleted:boolean;
    createdAt:Date;
    updatedAt:Date;
    
}